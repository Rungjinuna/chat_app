'use client';

import Input from '../../../components/inputs/Input';
import Button from '@/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const session = useSession(); //useSession훅을 사용하여 사용자의 세션상태 가져옴

  //컴포넌트가 마운트 될 떄와 session?.status 또는 router가 변경될때마다 실행
  //만약 사용자가 이미 인증되었다면 대화방 페이지로 라우팅
  //컴포넌트 렌더링 된 후 부수효과를 실행하는데 사용됨
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/conversations');
    }
  }, [session?.status, router]);

  //useCallback훅을 사용하여 variant 상태를 토글하는 함수 메모이제이션
  //현재 variant가 LOGIN이면 REGISTER로 그렇지않으면 LOGIN상태로 변경
  //variant가 바뀔때마다 함수가 불필요하게 재생성되는 것을 막기위해 함수 메모이제이션.
  //의존성 배열이 바뀌었을때만 함수를 재생성한다.

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  //react-hook-form 라이브러리의 useForm훅을 사용하여 폼처리 구현방법 보여줌
  //register함수를 이용하여 input,select,textarea등의 폼 요소를 React Hook Form에 등록
  //handleSubmit: 폼 제출을 처리하는 함수. 이 함수에 콜백 제공하여 폼제출시 실행할 로직 정의
  //errors:폼 필드의 유효성 검사 에러를 포함하는 객체. 각 필드의 유효성 검사 실패시 여기에 에러정보저장
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    //폼 필드의 초기값
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  //register 과정 처리 함수
  //사용자 인터페이스에서 form을 제출할때 호출됨, variant가 REGISTER일 경우 사용자 등록 로직 시작
  //variant가 LOGIN일 경우 로그인처리
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //함수 시작시 로딩상태 활성화
    setIsLoading(true);
    //axios라이브러리 사용하여 백엔드 서버의 /api/register 엔드포인트로 data를 HTTP POST 요청
    if (variant == 'REGISTER') {
      axios
        .post('/api/register', data)
        //성공적으로 사용자 등록한 후 같은 양식의 데이터를 사용하여 자동으로 로그인 시도(then이하)
        .then(() =>
          //next-auth signIn함수 이용. credentials 방식으로 로그인 처리.
          //redirect: false로 로그인 후 자동으로 리디렉션 비활성화
          signIn('credentials', {
            ...data, //data객체는 사용자가 입력한 로그인 정보 포함
            redirect: false,
          })
        )
        //로그인 요청이 성공적으로 처리 된 후의 콜백함수 (callback객체에 error속성있는지확인)
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials');
          }
          if (callback?.ok) {
            router.push('/conversations');
          }
        })
        //요청중 예외가 발생하면 오류메세지를 표시함
        .catch(() => toast.error('Something went wrong!'))
        //요청 성공여부와 상관없이 실행, 로딩상태 비활성화 (사용자 인터페이스 로딩인디케이터 숨기기)
        .finally(() => setIsLoading(false));
    }
    //variant가 LOGIN 상태일때 로그인처리
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials');
          }
          if (callback?.ok) {
            router.push('/conversations');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  //소셜미디어 로그인을 처리하는 함수
  //문자열 action을 인자로 받아서 해당 소셜 미디어 서비스를 이용한 로그인 시도
  const socialAction = (action: string) => {
    //로딩 인디케이터 활성화
    setIsLoading(true);

    //여기서 action은 로그인을 시도할 소셜미디어 서비스의 이름, 리디렉션 비활성화
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        if (callback?.ok) {
          router.push('/conversations');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id='name'
              label='이름'
            />
          )}
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id='email'
            label='이메일'
            type='email'
          />
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id='password'
            label='비밀번호'
            type='password'
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {variant === 'LOGIN' ? '로그인' : '회원가입'}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center '>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 text-gray-500 bg-white'>소셜 로그인</span>
            </div>
          </div>

          <div className='flex gap-2 mt-6'>
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>
        <div className='flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500 '>
          <div>
            {variant === 'LOGIN'
              ? '메신저를 처음 사용하시나요?'
              : '이미 계정이 있나요?'}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? '계정 만들기' : '로그인하기'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
