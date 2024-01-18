'use client';

import { User } from '@prisma/client';
import useActiveList from '../hooks/useActiveList';
import Image from 'next/image';

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  //useActiveList를 이용하여 현재 활성화상태인 사용자목록(members)를 가져옴
  const { members } = useActiveList();
  //isActive 변수는 members배열에 user.email이 존재하는지 확인.
  //user?.email! user객체가 존재하고 email속성이 null이나 undefined가 아니다. 단언.
  //user.email이 -1이 아니다, 즉 있으니 true이다.
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className='relative'>
      <div className='relative inline-block overflow-hidden rounded-full h-9 w-9 md:h-11 md:w-11'>
        {/* 이미지 컴포넌트를 사용하여 사용자의 프로필 이미지 표시 
        이미지가 없으면 기본이미지 '/image/placeholder.jpg 표시*/}
        <Image
          fill
          // 이미지가 부모요소를 완전히 채우도록하는 fill 속성
          src={user?.image || '/images/placeholder.jpg'}
          alt='Avatar'
          sizes='30'
        />
      </div>
      {/* 사용자가 활성화 상태일 경우, 프로필 이미지 옆에 녹색 점으로 활성상태 나타냄 */}
      {isActive ? (
        <span className='absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full ring-2 ring-white md:h-3 md:w-3' />
      ) : null}
    </div>
  );
};

export default Avatar;
