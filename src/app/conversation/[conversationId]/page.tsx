import getConversationById from '@/app/actions/getConversationById';
import getMessages from '@/app/actions/getMessages';

import Header from './components/Header';
import Body from './components/Body';
import Form from './components/Form';
import EmptyState from '@/components/EmptyState';

interface IParams {
  // 대화 Id를 나타내는 문자열, 이 Id는 대화를 조회하는데 사용됨
  conversationId: string;
}

//ChatId 비동기함수, 구조분해할당으로 params객체를 인자로 받음
//params 객체는 IParams타입을 가지며 conversationId를 포함함
//특정 대화와 그 대화에 속한 메세지를 가져오는 로직
const ChatId = async ({ params }: { params: IParams }) => {
  // 대화정보 가져오기
  // getConversationById함수를 비동기적으로 호출
  //주어진 대화 (params.conversationId)에 해당하는 대화정보를 conversation변수에 저장함
  const conversation = await getConversationById(params.conversationId);
  // 대화 메세지 가져오기
  //getMessages함수를 이용하여 동일한 대화 Id에 해당하는 메세지들을 가져와서 message변수에 저장
  const messages = await getMessages(params.conversationId);

  // 대화정보가 존재하지 않으면 EmptyState 컴포넌트 렌더링
  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <EmptyState />
        </div>
      </div>
    );
  }
// 대화정보가 존재하면 대화의 내용과 메세지를 표시함
  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ChatId;
