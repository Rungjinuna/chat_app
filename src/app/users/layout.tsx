import Sidebar from '@/components/sidebar/Sidebar';
import getUsers from '../actions/getUsers';
import UserList from './components/UserList';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //getUsers 함수를 비동기적으로 호출하여 사용자 목록을 가져옴
  const users = await getUsers();
  return (
    //Sidebar컴포넌트 안에 UserList컴포넌트를 넣어 사용자 목록을 표시,
    //children을 이 컴포넌트 하위요소로 포함시킴
    //UserList 컴포넌트는 items prop으로 사용자 목록을 받아 사용자를 표시함
    <Sidebar>
      <div className='h-full'>
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
