import prisma from '@/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversationById = async (conversationId: string) => {
  try {
    // getCurrentUser함수 호출하여 현재 로그인한 사용자의 정보 가져옴
    const currentUser = await getCurrentUser();
    //사용자가 로그인하지 않았거나 유효하지 않은 경우 null 반환
    if (!currentUser?.email) {
      return null;
    }
    // prisma.conversation.findUnique메소드 사용하여 데이터 베이스에서 특정 대화 조회
    const conversation = await prisma.conversation.findUnique({
      //where절에서 조회할 대화의 Id를 지정함
      where: {
        id: conversationId,
      },
      //include옵션으로 users:true를 설정
      //대화에 참여하는 사용자들의 정보도 함께 조회함
      include: {
        users: true,
      },
    });

    return conversation;
    //조회대상의 conversation 반환
    // catch로 조회과정에서 발생할 수 있는 에러 처리
  } catch (error: any) {
    console.log(error, 'SERVER_ERROR');
    // 콘솔창에 에러 표시하고 null 반환
    return null;
  }
};

export default getConversationById;
