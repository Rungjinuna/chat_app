'use client';

import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from 'react';
import Link from 'next/link';

import useOtherUser from '@/hooks/useOtherUser';
import useActiveList from '@/hooks/useActiveList';

import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import ProfileDrawer from './ProfileDrawer';
import { Conversation, User } from '@prisma/client';

interface HeaderProps {
  // conversation : 대화에 대한 정보를 포함하는 객체
  // 이 정보는 대화가 그룹대화인지, 얼마나 많은 사용자가 참여하고있는지 등을 나타냄
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  // useOtherUser 훅으로 대화에서 현재 사용자를 제외한 다른 사용자를 찾음
  const otherUser = useOtherUser(conversation);
  // drawerOpen 사용자 인터페이스 내에서 어떤 드로어나 메뉴가 열려있는지 여부를 나타내는상태
  const [drawerOpen, setDrawerOpen] = useState(false);
  // userActiveList훅을 통해서 현재 활성상태에 있는 사용자목록(members)를 가져옴
  const { members } = useActiveList();
  // isActive : otherUser의 이메일이 members 배열에 포함되어있는지 여부를 나타내는 상태
  // members배열에서 otherUser의 email속성이 위치한 인덱스를 반환하고
  // otherUser의 email이 members배열에 존재하지 않으면 -1을 반환
  // !== -1 은 indexOf함수의 반환값이 -1이 아닌경우를 확인함
  //otherUser의 email이 members배열에 존재하면 true, 존재하지 않으면 false
  //!== -1: 이 연산자는 indexOf 함수의 반환값이 -1이 아닌 경우를 확인
  //함수의 반환값이 -1이면 false -1이 아니면 true 임으로 true인 경우를 확인
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  //Header 컴포넌트안에서 해당 사용자가 현재 활성상태인지 아닌지를 알 수 있음

  //상태 텍스트 계산
  const statusText = useMemo(() => {
    // 그룹대화인 경우 그룹에 속한 사용자수를 나타냄
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    // 그룹대화가 아니면 상대방의 활성상태에따라 Active 혹은 Offline을 나타냄
    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  return (
    <>
      {/* 대화의 상세정보를 표시하는 드로어 */}
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className='
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      '
      >
        <div className='flex items-center gap-3'>
          {/* 대화목록으로 돌아가는 아이콘링크, lg:hidden : 모바일 화면에서만 표시 */}
          <Link
            href='/conversations'
            className='block text-orange-500 transition cursor-pointer lg:hidden hover:text-orange-600'
          >
            <HiChevronLeft size={32} />
          </Link>
          {/* 대화가 그룹대화인 경우 AvatarGroup 컴포넌트를 통해 여러 사용자의 아바타 표시 */}
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            // 그룹대화가 아닌경우 otherUser의 아바타 표시
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col'>
            {/* 대화의 이름 또는 개인 대화의 경우 상대방의 이름 표시 */}
            <div>{conversation.name || otherUser.name}</div>
            <div className='text-sm font-light text-neutral-500'>
              {/* statusText를 통해서 대화의상태표시 */}
              {statusText}
            </div>
          </div>
        </div>
        {/* 추가 옵션을 위한 메뉴 아이콘 */}
        <HiEllipsisHorizontal
          size={32}
          // 이 아이콘을 클릭하면 ProfileDrawer가 열리도록 설정
          onClick={() => setDrawerOpen(true)}
          className='text-orange-500 transition cursor-pointer hover:text-orange-600'
        />
      </div>
    </>
  );
};
export default Header;
