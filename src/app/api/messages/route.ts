import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { pusherServer } from '@/libs/pusher';
import prisma from '@/libs/prismadb';

export async function POST(request: Request) {
  try {
    // getCurrentUser함수 호출하여 현재 로그인한 사용자 확인
    const currentUser = await getCurrentUser();
    // 요청 데이터 처리
    // request.json() 메소드를 사용해 클라이언트로부터 전송된 데이터 추출
    // message, image, conversationId 추출
    const body = await request.json();
    const { message, image, conversationId } = body;
    // 유효한 사용자가 아니면 401 반환
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // 새 메시지 생성
    // prisma.message.create 메소드를 사용하여 새 메시지를 데이터베이스에 저장함
    // 메세지 데이터는 본문, 이미지, conversationId, currentUser.id 포함
    const newMessage = await prisma.message.create({
      include: {
        seen: true,
        sender: true,
      },
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
    // 대화 업데이트
    // prisma.conversation.update 메소드를 사용하여 대화를 업데이트함
    // 마지막 메세지의 시간을 현재시간으로 설정하고 새로 생성된 메세지를 대화에 연결함
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    // pusherServer.trigger메소드를 사용해서 conversationId채널에 message:new 이벤트 전송
    // 상대방의 대화창에 새로운 메세지를 보여주기위해서
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);
    // 마지막 메세지 추출
    // updatedConversation.messages 이 배열은 updatedConversation객체 내에 있는 메세지들 포함
    // updatedConversation은 대화에 대한 최신정보를 담고있으며, 여기에는 대화의 모든 메세지가 포함됨
    // updatedConversation.messages.length-1 :배열의 길이에서 1을 빼면 마지막 요소의 인덱스가 반환됨
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];
    //즉 배열의 마지막 요소를 나타내며 가장 최근에 추가된 메세지를 의미함

    //대화에 참여한 모든 사용자를 순회하면서
    // pusherServer객체의 trigger 메소드를 사용하여 pusher서버에 실시간 이벤트를 트리거함
    updatedConversation.users.map((user) => {
      // user,email은 pusher채널의 이름으로 사용됨
      //  conversation:update 트리거할 이벤트 이름
      // 여기서 Id와 messages(메세지배열, 여기서는 최근 메세지만 포함)를 내보냅니다.
      // 단언 연산자를 사용하여 user.email이 undefined 혹은 null이 아님을 단언함
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    });
    // 성공적으로 메세지를 처리한 후 newMessage객체를 Json형식으로 변환하여 응답함.
    return NextResponse.json(newMessage);
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Error', { status: 500 });
  }
}
