'use client';

import Input from '../../../components/inputs/Input';
import Button from '@/components/Button';
import AuthSocialButton from './AuthSocialButton';

const AuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FiledValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  return (
    <div className='mt-8 sm:max-auto sm:w-full sm:rounded-lg sm:px-10'>
      <div className='px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <Input />
          <Input />
          <div>
            <Button type='submit'></Button>
          </div>
        </form>
        <div>
          <div>
            <div>
              <div />
            </div>
            <div>
              <span>소셜로그인</span>
            </div>
          </div>
          <div>
            <AuthSocialButton />
            <AuthSocialButton />
          </div>
        </div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
