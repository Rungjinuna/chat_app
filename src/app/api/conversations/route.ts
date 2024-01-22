import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';
import getCurrentUser from '@/app/actions/getCurrentUser';

//POST 요청을 처리하는 비동기 함수
export async function POST(request: Request) {
  try {
    //getCurrentUser 함수를 호출하여 현재 사용자 정보 가져옴
    const currentUser = await getCurrentUser();
    //request.json을 통해 요청 본문을 JSON형태로 파싱함
    //userId,isGroup,members,name등 필요한 데이터 추출
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    //id와 email이 존재하지않으면 Unauthorized 와 함께 400상태 에러 반환(사용자인증X)
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    //요청이 그룹대화 생성을위한 것이라면 members 배열과 name의 유효성 검증
    //멤버수가 2명 미만이거나, name이 없는경우 Invalid data와 400에러
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }
    //isGroup이면 Prisma ORM을 사용하여 데이터베이스에 새 그룹 대화를 생성한다.
    //이 과정에서 name, isGroup, users가 데이터 베이스에 저장됨
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          //users는 members 배열에 현재 사용자를 추가하여 생성됨
          //users필드에 다른 레코드를 연결함(connect는 기존에 존재하는 레코드를 참조하여 연결을 형성)
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        // conversation 레코드를 조회할때 include :{users:true}를 사용하면
        //해당 대화에 참여하는 모든 사용자의 정보도 함께 조회한다.
        include: {
          users: true,
        },
      });

      // newConversation객체가 생성된 후, 이 객체에 포함된 각 사용자에 대해
      //이메일이 존재할 경우 Pusher서버를 통해 'conversation:new' 이벤트와 함께
      //newConversation 객체를 트리거한다.
      //이렇게 하면 사용자들은 새로운 대화가 시작 되었음을 알 수 있다.

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    console.log(newConversation);

    // Update all connections with new conversation
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
