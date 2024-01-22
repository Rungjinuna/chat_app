'use client';

import { User } from '@prisma/client';
import UserBox from './UserBox';

interface UserListProps {
  //User[] : prisma클라이언트의 User모델로부터 가져온 데이터 포함한 객체배열
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    // aside태그를 사용하여 사이드바 형태로 구성되어있음
    <aside className='fixed inset-y-0 left-0 block w-full pb-20 overflow-y-auto border-r border-gray-200 lg:pb-0 lg:left-20 lg:w-80 lg:block'>
      <div className='px-5'>
        <div className='flex-col'>
          <div className='py-4 text-2xl font-bold text-neutral-800'>사람들</div>
        </div>
        {/* 사람들이라는 텍스트 표시한 후, items 배열을 순회하며 각 사용자에 대한 UserBox렌더링 */}
        {items.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
