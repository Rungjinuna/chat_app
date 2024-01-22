import prisma from '@/libs/prismadb';
import getSession from './getSession';

const getUsers = async () => {
  //getSession함수를 호출하여 현재 세션 정보를 가져옴
  const session = await getSession();
  //세션검증. 세션정보에서사용자의 이메일이 존재하지 않는 경우 빈 배열 반환
  if (!session?.user?.email) {
    return [];
  }

  try {
    //user테이블에서 findMany메소드를 사용해 여러 조건에 맞는 사용자 찾기
    const users = await prisma.user.findMany({
      //orderBy:생성된날짜(createAt)를 기준으로 내림차순 정렬
      orderBy: {
        createdAt: 'desc',
      },
      //where: 현재 세션의 사용자 이메일과 다른 모든 사용자를 조회(NOT조건으로)
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
    //예외발생시 빈배열 반환
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
//getUsers 함수의 목적은 현재 세션의 사용자 이메일과 다른 모든 사용자들을 데이터베이스에서 가져옴
//그들을 생성된 날짜(createdAt) 기준으로 내림차순으로 정렬하여 반환하는 것
