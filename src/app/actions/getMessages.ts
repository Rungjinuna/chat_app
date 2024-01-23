import prisma from '@/libs/prismadb';

const getMessages = async (conversationId: string) => {
  try {
    // findMany 메소드를 이용하여 conversationId에 해당하는 모든 메세지 조회
    const messages = await prisma.message.findMany({
      // where조건
      // 특정대화에 속하는 메세지만 필터링
      where: {
        conversationId: conversationId,
      },
      // 옵션, sender와 seen 정보도 같이가져옴
      include: {
        sender: true,
        seen: true,
      },
      // createdAt 필드 기준 오름차순 정렬
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 조건에 부함하는 messages 반환
    return messages;
    // 에러발생시 빈배열 반환
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
