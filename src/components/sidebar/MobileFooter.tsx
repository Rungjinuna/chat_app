'use client';

import useConversation from '@/hooks/useConversation';
import useRoutes from '@/hooks/useRoutes';
import MobileItem from './MobileItem';

const MobileFooter = () => {
  //useRoutes는 경로 정보를 가져오는 훅
  const routes = useRoutes();
  //useConversation은 conversationId 존재 여부에따라 대화창 상태를 관리하는 훅
  //useConversation훅에서 isOpen 상태를 가져옴
  const { isOpen } = useConversation();

  //대화창이 열려있는 경우 null 반환 (대화창이 열려있을때만 보이도록!)
  if (isOpen) {
    return null;
  }
  //대화창이 열려있지 않은 경우 routes배열을 매핑하여 각 라우트에 대한 MobileItem컴포넌트 렌더링
  return (
    <div
      className='
    fixed 
    justify-between 
    w-full 
    bottom-0 
    z-40 
    flex 
    items-center 
    bg-white 
    border-t-[1px] 
    lg:hidden
  '
    >
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};
export default MobileFooter;
