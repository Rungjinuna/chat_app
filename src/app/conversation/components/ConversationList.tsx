'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx';
import { find, uniq } from 'lodash';

import useConversation from '@/hooks/useConversation';
import { pusherClient } from '@/libs/pusher';
import GroupChatModal from '@/components/modals/GroupChatModal';
import ConversationBox from './ConversationBox';
import { FullConversationType } from '@/types';

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  //useConversation훅에서 conversationId와 isOpen 여부를 가져옴
  const { conversationId, isOpen } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  //실시간 통신키 설정
  //pusherKey: useMemo훅을 사용하여 세션 데이터중 사용자의 이메일을 Pusher 통신에 사용할 키로 설정함
  const pusherKey = useMemo(() => {
    //세션 데이터에서 사용자의 이메일 가져옴.
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  //pusherKey가 없는 경우 (예:사용자가 로그인하지 않아 이메일이 없는경우) 나머지 함수 실행X
  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    //Pusher클라이언트를 사용하여 pusherKey로 지정된 채널에 구독
    //실시간 이벤트를 수신하는데 사용됨
    pusherClient.subscribe(pusherKey);

    //updateHandler함수 : conversation이 업데이트 될때마다 호출
    //setItems를 사용하여 현재 대화목록 (items)을 업데이트함
    //current를 순회하면서 (대화목록) 업데이트된 ID가 현재 목록에 있는 대화의 ID와 일치하는 경우
    //해당 대화의 메세지를 새로운 메세지로 업데이트함
    //대화의 메세지가 변경되면 이 변경사항을 대화목록에 반영하여 사용자가 인터페이스를 최신으로 유지
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    //새 대화가 새성될 때 호출
    //대화목록에 이미 같은 ID가 있는지 확인함, 있으면 current 반환
    //존재하지 않으면 새 대화를 목록에 맨앞에 추가
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    //대화제거 핸들러
    //특정 대화가 제거되어야 할 때 호출
    //해당 Id를 가진 대화를 대화목록에서 필터링하여 제거함
    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
    };

    //pusher이벤트 바인딩
    //Pusher 클라이언트에 각 이벤트타입에 대해 해당 핸들러를 바인딩함
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:remove', removeHandler);

    //컴포넌트가 언마운트 될 때 실행되는 정리 함수
    //pusherClient.bind.unsubscribe : 구독 채널 취소
    //pusherClient.unbind: new 이벤트에 대한 핸들러 바인딩을 해제함
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
    };
  }, [pusherKey, router]);

  //대화목록을 업데이트하고, pusher이벤트에 바인딩을 함으로써 사용자가 실시간으로 정보확인할 수있게함
  //컴포넌트 언마운트시 불필요한 이벤트 리스너와 네트워크 연결을 정리하여 리소스 낭비 방지

  return (
    <>
      {/* 그룹채팅모달 */}
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* 사이드바 */}
      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
          // isOpen 상태에따라 사이드바의 표시여부 결정됨
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className='px-5'>
          <div className='flex justify-between pt-4 mb-4'>
            <div className='text-2xl font-bold text-neutral-800'>채팅 앱</div>
            {/* 그룹추가 아이콘을 클릭하면 모달이 열리도록 설정 */}
            <div
              onClick={() => setIsModalOpen(true)}
              className='p-2 text-gray-600 transition bg-gray-100 rounded-full cursor-pointer hover:opacity-75'
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {/* items 배열을 순회하면서 각 대화에 대해 ConversationBox 컴포넌트를 렌더링 */}
          {items.map((item) => (
            // 대화데이터(data)와 현재 대화가 선택되었는지 여부(selected)를 props로 전달
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
