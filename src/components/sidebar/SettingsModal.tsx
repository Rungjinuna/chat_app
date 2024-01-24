'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { CldUploadButton } from 'next-cloudinary';

import Input from '../inputs/Input';
import Modal from '../modals/Modal';
import Button from '../Button';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  // User타입을 가지는 currentUser를 prop으로 받는데 초기값은 빈객체
  currentUser = {},
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    // watch는 useForm훅으로부터 가져옴
    // 필드값 변화를 관찰하고 반환함
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    // 폼의 초기값 설정
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });
  // image라는 이름의 폼 필드의 현재값을 관찰하고 반환함
  // image 변수에 현재 이미지 필드 값 저장
  const image = watch('image');
  //업로드함수
  //serValue함수를 호출하여 이미지 url 받아와서 유효성검사
  const handleUpload = (result: any) => {
    setValue('image', result.info.secure_url, {
      shouldValidate: true,
    });
  };

  // onSubmit함수 호출시 setIsLoading상태는 true로 변경
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    // axios이용해서 엔드포인트에 data post요청
    // 요청후에 라우터 리프레시 하고 창닫기
    axios
      .post('/api/settings', data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong!'))
      // 요청 여부와 상관없이 로딩상태 false로 변경
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='pb-12 border-b border-gray-900/10'>
            <h2 className='text-base font-semibold leading-7 text-gray-900 '>
              프로필
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              프로필을 수정하세요.
            </p>

            <div className='flex flex-col mt-10 gap-y-8'>
              <Input
                disabled={isLoading}
                label='Name'
                id='name'
                errors={errors}
                required
                register={register}
              />
              <div>
                <label
                  htmlFor='photo'
                  className='block text-sm font-medium leading-6 text-gray-900 '
                >
                  Photo
                </label>
                <div className='flex items-center mt-2 gap-x-3'>
                  <Image
                    width='48'
                    height='48'
                    className='rounded-full'
                    src={
                      image || currentUser?.image || '/images/placeholder.jpg'
                    }
                    alt='Avatar'
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET
                    }
                  >
                    <Button disabled={isLoading} secondary type='button'>
                      Change
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-end mt-6 gap-x-6'>
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} type='submit'>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
