import React from 'react';
import { IconType } from 'react-icons/lib';

//컴포넌트가 받을 props 타입정의
interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

//컴포넌트 정의
//AuthSocialButtonProps타입의 props를 받아서 소셜로그인 버튼 렌더링
//props에서 icon을 받아오고, 이를 Icon 컴포넌트로 사용함
//onClick : 이벤트핸들러로 버튼이 클릭될때 실행될 함수를 props에서 받아옴
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='inline-flex justify-center w-full px=4 py-2 text-gray-500 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gary-300 
    hover:bg-gray-50 focus:outline-offset-0'
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
