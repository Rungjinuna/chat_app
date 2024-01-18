import getCurrentUser from '@/app/actions/getCurrentUser';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

async function Sidebar({ children }: { children: React.ReactNode }) {
  //currentUser에 비동기함수 getCurrentUser를 정의함. 현재 사용자 정보를 비동기적으로 가져옴
  const currentUser = await getCurrentUser();
  return (
    <div className='h-full'>
      {/* 최상위요소에 DesktopSidebar를 배치하고 currentUser를 prop으로 전달 */}
      <DesktopSidebar currentUser={currentUser!} />
      {/* MobileFooter는 추가적인 props없이 렌더링됨 */}
      <MobileFooter />
      <main className='h-full lg:pl-20'>{children}</main>
    </div>
  );
}

export default Sidebar;
