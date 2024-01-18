//네비게이션에 사용될 경로들을 정의하고 관리함
//각각의 경로는 레이블, 하이퍼링크, 아이콘, 그리고 현재 경로가 활성화 상태인지 나타내는 플래그 액티브를 포함

import { usePathname } from 'next/navigation';
import useConversation from './useConversation';
import { useMemo } from 'react';
import { HiChat, HiUser } from 'react-icons/hi';
import { HiArrowLeftOnRectangle } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';

//userRoutes는 useMemo훅을 사용하여 경로정보를 메모이제이션함, 의존성배열의 값이 변경될 때만 경로 정보가 재계산
const useRoutes = () => {
  //next.js의 usePathname훅은 현재 url의 경로명을 읽을 수 있게 해준다. 클라이언트 컴포넌트 훅.
  const pathname = usePathname();
  const { conversationId } = useConversation();
  //useMemo로 계산된 값을 메모이제이션 (경로정보)
  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversation',
        icon: HiChat,
        // 현재 경로가 '/conversations'이거나 대화 ID가 존재하면 활성화 상태가 됨
        active: pathname === '/conversations' || !!conversationId,
      },
      {
        label: 'User',
        href: '/users',
        icon: HiUser,
        active: pathname === '/users',
      },
      {
        label: 'Logout',
        onClick: () => signOut(),
        href: '#',
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );
  return routes;
};

export default useRoutes;

//useRoutes훅은 계산된 routes배열을 반환한다.
//이 배열은 네비게이션 컴포넌트에서 각 경로를 렌더링하는데 사용된다.
//네비게이션 바나 메뉴 링크 목록을 동적으로 생성하고 관리하는데 사용된다.
//현재 url경로와 conversationId에 따라 활성화 상태를 결정하고,
//로그아웃기능을 포함하여 사용자 인터랙션을 처리할 수 있다.
