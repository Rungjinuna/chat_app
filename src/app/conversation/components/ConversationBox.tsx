'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Conversation, Message, User } from '@prisma/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

import Avatar from '@/components/Avatar';
import useOtherUser from '@/hooks/useOtherUser';
import AvatarGroup from '@/components/AvatarGroup';
import { FullConversationType } from '@/types';

interface ConversationBoxProps {
  data: FullConversationType; //FullConversationType은 객체로 대화에 관한 전체 정보 담고있음
  selected?: boolean; //selected prop은 해당 대화상자가 현재 선택되었는지 여부
}
//ConversationBox 컴포넌트
const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  //useOtherUser훅 : 대화에서 현재 로그인한 사용자를 제외한 다른 사용자를 찾음
  //다른사용자의 정보렌더링하는데 필요
  const otherUser = useOtherUser(data);
  //useSession훅 : 현재 로그인한 사용자의 세션 정보를 가져옴. 사용자의 로그인상태나 세션 데이터에 접근하는데 사용
  const session = useSession();
  //userRouter훅 : 다른 페이지로 라우팅 관리
  const router = useRouter();
  //handleClick콜백 : useCallback훅 사용하여 메모이제이션 된 콜백함수 생성
  //대화상자 클릭시 실행, router.push로 해당 대화 상세페이지로 라우팅
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);
  //마지막 메세지 계산(useMemo)
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    //messages.length-1로 배열의 마지막 요소(마지막 메세지)를 반환함. 메세지 없는경우 빈배열반환
    return messages[messages.length - 1];
  }, [data.messages]);
  //현재 사용자의 이메일 메모이제이션해서 값 가지고있기
  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );
  //읽음여부 확인
  //마지막 메세지가 현재 사용자에 의해 읽혔는지 여부 계산
  const hasSeen = useMemo(() => {
    //!lastMessage조건이 true이면 false를 반환
    //!lastMessage == 메시지가 없으면 true == 조건이 참이면 false반환
    //메세지가 없으면 사용자가 읽을 수 있는 메세지 자체가 없으니 hasSeen false.
    if (!lastMessage) {
      return false;
    }
    //seenArray 배열은 lastMessage의 seen 속성 혹은 빈배열
    //seenArray 마지막 메세지를 읽은 사용자들의 목록을 포함(lastMessage.seen)
    const seenArray = lastMessage.seen || [];
    //userEmail이 존재하지 않으면(true) false 반환
    //현재 로그인한 사용자의 정보가 없다는 것
    if (!userEmail) {
      return false;
    }
    //위 두 조건이 모두 false일때, (lastMessage도 있고 userEmail도 있을때)
    //lastMessage의 seen 배열에서 사용자의 이메일과 일치하는 항목만 찾음
    //filter결과로 생성된 배열의 길이 length가 0이 아니라면, 이는 현재 사용자가 마지막 메세지를 읽었다는 것
    //마지막 메세지를 읽은 사용자들의 목록을 포함한 seenArray배열에서
    //현재 로그인한 사용자의 이메일과 일치하는 항목을 찾음
    //마지막으로 메세지를 읽은 사용자들의 목록에 현재 로그인한 사용자가 존재함 -> 마지막 메세지 읽음
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  //마지막 메세지 텍스트 계산
  const lastMessageText = useMemo(() => {
    //마지막 메세지에 이미지가 있는 경우 sent an image라는 문자열 반환
    if (lastMessage?.image) {
      return 'Sent an image';
    }
    //마지막 메세지에 텍스트 본문이 있는경우 그 본문을 반환함
    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    //두가지 경우가 모두 해당하지 않으면 기본 메세지 반환(대화없는경우 텍스트로 사용됨)
    return '대화를 시작했습니다.';
  }, [lastMessage]);

  return (
    <div
      // 대화페이지로 라우팅
      onClick={handleClick}
      // 동적 클래스 생성
      className={clsx(
        `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        mb-3
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {/* 대화가 그룹인 경우 AvatarGroup컴포넌트, 그렇지않으면 Avatar컴포넌트 */}
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className='flex-1 min-w-0'>
        <div className='focus:outline-none'>
          <span className='absolute inset-0' aria-hidden='true' />
          <div className='flex items-center justify-between mb-1'>
            {/* 대화의 이름 또는 사용자의 이름을 표시함 */}
            <p className='font-medium text-gray-900 text-md'>
              {data.name || otherUser.name}
            </p>
            {/* 마지막 메세지의 생성시간을 포맷하여 표시
            lastMessage객체가 존재하고 createdAt속성이 정의되어있을때만 렌더링 */}
            {lastMessage?.createdAt && (
              <p className='text-xs font-light text-gray-400 '>
                {/* date-fns 라이브러리의 format함수 이용
                new Date(lastMessage.createdAt)은 문자열로 된 날짜를 
                js의 Date객체로 변환하고 'p'는 시간을 표시하는 특정포맷을 나타냄*/}
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate 
              text-sm
              `,
              // 읽음 여부에따라 텍스트의 스타일을 다르게 정의함
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
