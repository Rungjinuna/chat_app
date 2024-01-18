import getConversations from '../actions/getConversations';
import getUsers from '../actions/getUsers';
import Sidebar from '@/components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //getConversations와 getUsers 함수를 비동기적으로 호출하여 대화목록과 사용자 목록을 가져옴
  const conversations = await getConversations();
  const users = await getUsers();

  //Sidebar안에 ConversationsList 컴포넌트 배치
  //ConversationsList는 users, title, initialItems props를 받아서 대화목록 표시
  //children prop을 통해서 추가적인 자식요소들을 내부에 포함
  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList
          users={users}
          title='Messages'
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}
