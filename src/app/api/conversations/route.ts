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
      //newConversation 객체를 트리거한다.(Pusher API를 호출하여 특정 채널에 이벤트 트리거)
      //이렇게 하면 사용자들은 새로운 대화가 시작 되었음을 알 수 있다.

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });
      //NextResponse : Next.js에서 사용하는 객체. HTTP응답을 나타냄
      //서버에서 클라이언트로 응답을 보낼때 사용됨
      //생성된 newConversation객체를 JSON형태로 반환함
      return NextResponse.json(newConversation);
    }

    //기존대화찾기
    //conversation테이블에서 조건에 맞는 모든 레코드를 비동기적으로 검색
    const existingConversations = await prisma.conversation.findMany({
      //where은 검색 조건을 명시함
      //OR은 두개이상의 조건 중 하나라도 만족하는 레코드를 찾음
      where: {
        OR: [
          {
            // conversation 테이블에서 userIds필드를 기준으로 검색
            userIds: {
              // userIds필드가 currentUser.id와 userId 두 값으로 구성된 배열과 일치하는 레코드 찾음
              equals: [currentUser.id, userId],
            },
          },
          {
            // userIds 필드가 userId와 currentUser.id 순서로 구성된 배열과 일치하는 레코드를 찾음
            userIds: {
              equals: [userId, currentUser.id],
              // currentUser.id와 userId가 포함된 모든 대화 레코드를 찾음
            },
          },
        ],
      },
    });

    //찾은 existingConversations중 첫번째대화 singleConversation
    const singleConversation = existingConversations[0];

    //첫번째 대화가 존재하면 이를 반환함
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }
    //첫번째 대화가 존재하지 않는 경우 currentUser.id와 userId를 연결하는 새로운 대화생성
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

    //새로운 대화 생성된 경우, 이 대화에 참여하는 모든 사용자에게 이메일을 통해 conversation:new 이벤트 트리거
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
    // 함수에서 발생하는 모든 예외를 catch블록에서 잡아내고 처리
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
