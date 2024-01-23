import { FullConversationType } from '@/types';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
//현재 로그인한 사용자를 제외한 대화에 참여하고있는 다른 사용자를 찾는데 사용되는 함수
const useOtherUsers = (
  //conversation은 FullConversationType 혹은 {users:User[]} 구조를 가진 객체를 매게변수로 받음
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession();
  //session.data?.user?.email이 변경될때마다 값을 재계산
  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;
    //대화에 참여하고있는 사용자 목록에서 현재 사용자를 제외한 다른 사용자를 찾음 (이메일이 다른 사용자 filter)
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );
    // 필터링 된 사용자 목록에서 첫번째 사용자 반환
    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);
  return otherUser;
};
export default useOtherUsers;
