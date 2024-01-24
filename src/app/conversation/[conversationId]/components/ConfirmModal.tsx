'use client';

import React, { useCallback, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modals/Modal';
import Button from '@/components/Button';
import useConversation from '@/hooks/useConversation';
import { toast } from 'react-hot-toast';

interface ConfirmModalProps {
  // 모달의 열림/닫힘 상태를 나타내는 boolean값
  isOpen?: boolean;
  //모달을 닫는 함수
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  // useConversation훅에서 conversationId를 가져옴
  const { conversationId } = useConversation();
  //로딩중 상태관리
  const [isLoading, setIsLoading] = useState(false);

  //삭제 처리를 위한 useCallback함수
  const onDelete = useCallback(() => {
    setIsLoading(true);

    //axios를 통해 서버에서 conversationId 엔드포인트를 주소를 삭제
    axios
      .delete(`/api/conversations/${conversationId}`)
      // 요청 처리 후 모달을 닫고 대화목록페이지로 라우팅하며 리프레시
      .then(() => {
        onClose();
        router.push('/conversations');
        router.refresh();
      })
      // 요청 과정중 발생하는 문제 처리
      .catch(() => toast.error('Something went wrong!'))
      //요청 성공 여부와 관계없이 로딩상태 false처리
      .finally(() => setIsLoading(false));
    //의존성배열인 라우터와, 대화상태, 닫기함수가 변경될때마다 함수실행
  }, [router, conversationId, onClose]);

  return (
    // 모달컴포넌트 사용하여 기본적인 모달 구조 제공
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10'>
          {/* 경고아이콘과 삭제 경고 메세지 표시 */}
          <FiAlertTriangle
            className='w-6 h-6 text-red-600'
            aria-hidden='true'
          />
        </div>
        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
          {/* headlessui 라이브러리에서 Dialog.Title사용 */}
          <Dialog.Title
            as='h3'
            className='text-base font-semibold leading-6 text-gray-900'
          >
            대화 삭제
          </Dialog.Title>
          <div className='mt-2'>
            <p className='text-sm text-gray-500'>
              이 대화를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
        {/* 삭제버튼에 onDelete 함수 연결 */}
        <Button disabled={isLoading} danger onClick={onDelete}>
          삭제
        </Button>
        {/* 취소버튼에 onClose 함수 연결 */}
        <Button disabled={isLoading} secondary onClick={onClose}>
          취소
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
