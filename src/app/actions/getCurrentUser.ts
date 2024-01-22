import getSession from './getSession';
import prisma from '@/libs/prismadb';

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    //session의 user객체와 그 안에 email속성이 없으면 null값 반환
    if (!session?.user?.email) {
      return null;
    }
    //prisma의 findUnique 메소드사용하여 email 기준으로 사용자 찾기
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });
    //currentUser가 없으면 null값 반환, 그렇지않으면 그대로 currentUser를 반환함
    if (!currentUser) {
      return null;
    }
    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
