import prisma from '@/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
  //사용자 정보를 가져오기 위한 함수 getCurrentUser호출
  const currentUser = await getCurrentUser();
  //getCurrentUser함수에서 반환된 currentUser 객체의 id가 존재하지 않으면 빈배열반환
  if (!currentUser?.id) {
    return [];
  }
  //prisma.conversation.findMany메서드를 사용하여 대화목록을 조회
  try {
    const conversations = await prisma.conversation.findMany({
      // prisma쿼리
      //orderBy: 대화목록을 lastMessageAt필드에 따라 내림차순으로 정렬
      //최신메시지가 있는 대화를 상단에 표시하기위해
      orderBy: {
        lastMessageAt: 'desc',
      },
      // userIds배열에 currentUser.id가 포함된 대화를 조회조건으로 설정함
      //현재 사용자가 참여하고있는 대화만을 가져오기위해
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      //대화에 포함된 사용자 users와 메세지 정보를 함께 가져옴
      //메세지에 대해서는 sender와 seen(읽음여부) 정보도 함께 포함
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
