'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

import { pusherClient } from '@/libs/pusher';
import useConversation from '@/hooks/useConversation';
import MessageBox from './MessageBox';
import { FullMessageType } from '@/types';
import { find } from 'lodash';

interface BodyProps {
  // 초기메시지 설정, 초기에 표시할 메세지 목록제공
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  // useRef훅은 변경가능한 Ref객체를 반환함
  // 이 객체는 current속성을 가지고있으며, 이 속성은 초기화 될 때 전달된 인자(null)로 설정됨
  // HTMLDivElement 타입스크립트의 타입정의, Ref가 HTML <div>요소를 참조한다는것을 나타냄

  // div요소에 직접 접근 -> 컴포넌트 내부의 특정 위치로 스크롤하기위해 사용함
  const bottomRef = useRef<HTMLDivElement>(null);
  // 메세지 목록 상태 관리 , 초기상태는 initialMessage로 설정됨
  const [messages, setMessages] = useState(initialMessages);
  //useConversation 훅에서 conversationId 추출
  const { conversationId } = useConversation();
  // 컴포넌트가 마운트되거나 conversationId가 변경될때 엔드포인트로 Post 요청
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  // 컴포넌트가 마운트될 때 대화의 푸셔채널 구독
  // bottomRef?.current?.scrollIntoView() 호출을 통해서 화면을 자동으로 스크롤
  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();
    // 메세지핸들러
    // 새 메세지가 도착하면 메세지핸들러 호출되고 메세지 목록에 추가됨
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      // current를 기반으로 새로운 상태를 계산함
      // lodash의 find함수를 사용하여 현재 메세지 목록에서 동일한 Id를 가진 메세지가 이미 있는지를 확인
      // 있으면 현재상태(current)그대로 반환함
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        // 만약 동일한 Id를 가진 메세지가 없다면 새로운 메세지를 현재메세지 목록의 끝에 추가함
        return [...current, message];
      });
      // 자동스크롤
      bottomRef?.current?.scrollIntoView();
    };
    // 새로 업데이트된 메세지 처리
    const updateMessageHandler = (newMessage: FullMessageType) => {
      // setMessage에 전달된 콜백함수는 current(현재 메세지목록)를 기반으로 새로운 목록 생성
      // 현재 처리중인 메세지id가 새 매세지의 id와 동일한지 확인
      // 일치하는 경우 newMessage로 현재 메세지 대체
      // 일치하지 않으면 현재메세지를 그대로유지함
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    // 신규메세지와 메세지업데이트이벤트에 핸들러를 bind함
    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className='pt-24' ref={bottomRef} />
    </div>
  );
};

export default Body;
