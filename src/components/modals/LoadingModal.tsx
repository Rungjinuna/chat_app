'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ClipLoader } from 'react-spinners';

const LoadingModal = () => {
  return (
    //Transition.Root : 전체적인 애니메이션 효과를 적용하는 루트 컨테이너
    //show: Transition.Root컴포넌트 표시여부(true or false)
    //as={Fragment} Transition.Root컴포넌트가 실제로 추가적인 DOM요소를 생성하지않고,
    //자식 컴포넌트들을 그룹화하여 렌더링 (react의 fragment의미)
    <Transition.Root show as={Fragment}>
      {/* Dialog는 모달 또는 대화상자 만들때 사용됨
      as='div'는 Dialog 컴포넌트가 <div>태그로 렌더링 되야함을 의미 */}
      <Dialog as='div' className='relative z-50' onClose={() => {}}>
        {/* Transition.Child는 Transition컴포넌트의 자식 요소에 대한 애니메이션 효과정의 */}
        <Transition.Child
          // 애니메이션의 다양한 단계를 정의하는 속성들
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 transition-opacity bg-gray-100 bg-opacity-50 ' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4 text-center '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              {/* Dialog.panel:대화상자의 주요내용을 담는 부분
              모달이나 팝업 내에서 사용자에게 표시되는 주요 내용을 감싸는 역할 */}
              <Dialog.Panel>
                {/* ClipLoader: react=spinners라이브러리에서 제공하는 로딩 인디케이터 컴포넌트
                이 컴포넌트는 로딩중임을 사용자에게 시각적으로 알리는 클립형태의 스피너 표시  */}
                <ClipLoader size={40} color='#0284c7' />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LoadingModal;
