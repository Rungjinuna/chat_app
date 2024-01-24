import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/actions/getCurrentUser';
import { pusherServer } from '@/libs/pusher';
import prisma from '@/libs/prismadb';

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // findUnique사용해서 특정대화 찾기
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });
    // 대화존재하지않으면 400상태 반환
    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // 마지막 메세지찾기
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    // 마지막 메세지가 아니면 conversation반환
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // prisma 메소드 이용해서 메세지를 업데이트.
    // 마지막 마세제의 읽음 상태를 업데이트함
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // // Update all connections with new seen
    // await pusherServer.trigger(currentUser.email, 'conversation:update', {
    //   id: conversationId,
    //   messages: [updatedMessage]
    // });

    // If user has already seen the message, no need to go further
    // 사용자가 이미 메세지를 읽었다면(lastMessage.seenId에 현재 사용자의 id가 있으면
    // conversation 그대로 반환
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // Update last message seen
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage
    );

    return new NextResponse('Success');
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse('Error', { status: 500 });
  }
}
