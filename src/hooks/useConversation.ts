import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useConversation = () => {
  //useParams를 사용하여 현재 url의 파라미터들을 가져옴
  const params = useParams();
  //useMemo를 이용하여 conversationId를 계산함.
  //url파라미터 중 conversationId가 존자해면 그 값을 사용하고 그렇지않으면 빈문자열 반환
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }
    return params.conversationId as string;
  }, [params?.conversationId]);

  //대화창 열림 여부 확인
  //useMemo를 사용하여 conversationId 존재 여부에 따라 대화창이 열려있는지를 결정함
  const isOpen = useMemo(() => {
    !!conversationId;
  }, [conversationId]);

  //isOpen과 conversationId를 포함하는 객체를 반환함
  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
//대화창 관련 상태를 관리
//대화창이 열려있는지와 현재 대화의 ID를 추적함
