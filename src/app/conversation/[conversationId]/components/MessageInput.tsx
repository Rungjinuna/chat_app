'use client';

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
}) => {
  return (
    <div className='relative w-full'>
      <input
        id={id}
        type={type}
        // 브라우저가 자동완성 기능을 사용할지 여부를 제어함, 이전 입력을 기반으로 입력필드를 자동완성가능
        // id값을 기반으로 자동완성을 설정함
        autoComplete={id}
        // id라는 이름의 필드를 폼에 등록함
        // {required} 는 필드가 필수 입력 필드임을 나타내는 유효성 검사 규칙
        // register함수가 반환하는 props 객체를 input태그에 바로 전달함
        {...register(id, { required })}
        placeholder={placeholder}
        className='w-full px-4 py-2 font-light text-black rounded-full bg-neutral-100 focus:outline-none'
      />
    </div>
  );
};

export default MessageInput;
