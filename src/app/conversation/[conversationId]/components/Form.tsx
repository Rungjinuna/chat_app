'use client';

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { CldUploadButton } from 'next-cloudinary';
import useConversation from '@/hooks/useConversation';

const Form = () => {
  // useConversation 훅에서 conversationId 추출
  const { conversationId } = useConversation();

  //FieldValues는 타입스크립트 인터페이스, 폼의 필드값 타입 정의
  //register 이 함수는 입력 필드를 useForm에 등록하기 위해 사용됨
  //각 필드에 register를 연결하여 해당 필드 값이 폼 데이터에 포함되도록함
  //handleSubmit 폼 제출 처리 함수, 사용자가 폼을 제출했을때 실행될 콜백함수를 인자로 제공
  //setValue 특정 필드 값을 프로그래매틱하게 설정할때 사용(프로그램 로직에 의해서 자동으로 수행되는)
  // errors 폼의 검증 오류를 담고있는 객체
  // defaultValues 폼의 초기값 설정, 여기서는 message필드의 초기값을 빈 문자열로 설정
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  //onSubmit 함수 : 폼이 제출될때 호출되는 함수
  //data매개 변수는 사용자가 폼에 입력한 데이터를 포함
  // 이 데이터는 폼 제출시 서버로 전송되거나 다른 처리를 위해 사용 될 수 있음
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // setValue함수 호출
    //message라는 필드값을 빈 문자열로 설정함
    // shouldValidate:true 옵션은 이 값 변경 시 해당 필드의 유효성 검사를 다시 수행하도록 지시
    // 사용자가 메세지 전송 후 입력 필드를 비우고 (빈문자열) 필드가 다음 입력을 위해 올바르게 초기화되었는지 확인
    setValue('message', '', { shouldValidate: true });
    // axios를 통해 엔드포인트에 Post요청을 보냄
    // data객체의 모든 프로퍼티를 새 객체에 복사, conversationId는 현재 대화의 식별자
    // 이 값을 요청 데이터에 추가하여 서버가 어떤 대화에서 메세지를 추가해야하는지 알 수 있도록함
    axios.post('/api/messages', {
      ...data,
      conversationId: conversationId,
    });
  };

  // 업로드 함수, 이미지 업로드 이후 호출됨
  // 업로드한 이미지 url을 받아서 axios로 post요청
  // 해당 이미지를 특정 대화에 첨부하는 것
  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      //  업로드된 이미지의 url을 나타냄
      image: result.info.secure_url,
      // 현재 대화의 식별자 포함
      conversationId: conversationId,
    });
  };

  return (
    <div className='flex items-center w-full gap-2 px-4 py-4 bg-white border-t lg:gap-4'>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}
      >
        <HiPhoto size={30} className='text-orange-500' />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center w-full gap-2 lg:gap-4'
      >
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder='채팅을 입력해주세요.'
        />
        <button
          type='submit'
          className='p-2 transition rounded-full cursor-pointer bg-orange-500 hover:bg-orange-600'
        >
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  );
};

export default Form;
