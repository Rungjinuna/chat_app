import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

//getServerSession 메소드는 서버측에서 현재 세션 정보를 가져오는데 사용
//비동기함수 getSession을 호출,
//getServerSession 함수를 사용하여 authOptions를 바탕으로 현재 서버세션을 가져옴
export default async function getSession() {
  return await getServerSession(authOptions);
}
