'use client'; //서버측 렌더링 방지, 클라이언트 측에서만 컴포넌트 실행

import { User } from '@prisma/client';
import React, { useState } from 'react';
import useRoutes from '@/hooks/useRoutes';
import SettingsModal from './SettingsModal';
import DesktopItem from './DesktopItem';
import Avatar from '../Avatar';

//컴포넌트의 프로퍼티 타입정의
interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  //isOpen이라는 상태 정의하고 SettingsModal 열고닫는데 사용
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen}
      />
      {/* lg: 접두사는 데스크톱 크기의 화면에만 적용되는 스타일임 */}
      <div
        className='
        hidden 
        lg:fixed  
        lg:inset-y-0 
        lg:left-0 
        lg:z-40 
        lg:w-20 
        xl:px-6
        lg:overflow-y-auto 
        lg:bg-orange-400 
        lg:border-r-[1px]
        lg:pb-4
        lg:flex
        lg:flex-col
        justify-between
      '
      >
        <nav className='flex flex-col justify-between mt-4'>
          <ul role='list' className='flex flex-col items-center space-y-1'>
            {/* routes배열에 있는 각 경로에 대한 DesktopItem컴포넌트 렌더링 */}
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className='flex flex-col items-center justify-between mt-4'>
          {/* Avatar컴포넌트가 속해있는 div를 클릭하면 모달창이 열림 */}
          <div
            onClick={() => setIsOpen(true)}
            className='transition cursor-pointer hover:opacity-75'
          >
            {/* Avatar 컴포넌트는 currentUser 정보 사용 */}
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
