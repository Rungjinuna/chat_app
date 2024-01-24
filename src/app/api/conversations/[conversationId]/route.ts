import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    // params로부터 conversationId를 추출함
    const { conversationId } = params;
    // 로그인한 사용자 정보 가져옴
    const currentUser = await getCurrentUser();

    //로그인한 사용자가 없으면 null 반환
    if (!currentUser?.id) {
      return NextResponse.json(null);
    }

    //users가 포함된 conversationId를 가진 대화를 찾음(findUnique)
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    //존재하는 대화가없으면 400상태코드와 함께 오류메세지 반환
    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    //deleteMany 메소드를 사용하여 대화 삭제
    //삭제 조건에는 conversationId와 userId가 포함됨 (currentUser.id)
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    //대화에 참여한 사용자들(existingConversation.users)배열을 돌면서
    //pusherSever.trigger를 사용해 대화삭제 알림 전송
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          'conversation:remove',
          existingConversation
        );
      }
    });

    //삭제된 대화의 정보(deletedConversation)를 JSON형태로 반환
    return NextResponse.json(deletedConversation);
    // 예외 발생시 null 반환
  } catch (error) {
    return NextResponse.json(null);
  }
}
