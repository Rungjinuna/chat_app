import axios from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

import Avatar from '@/components/Avatar';
import LoadingModal from '@/components/modals/LoadingModal';

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //사용자가 UserBox를 클릭했을때 호출되는 handleClick함수
  //handleClick함수는 axios를 사용하여 서버에 대화시작을 위한 POST요청을 보냄
  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      //'api/conversations 엔드포인트에 post요청을 보내고
      //data를 받아 요청이 완료되면 해당 대화페이지로 라우팅함
      .post('/api/conversations', { userId: data.id })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      //요청 여부와 상관없이 실행됨. 로딩상태 false로 변경
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {/* 사용자가 클릭하여 대화를 시작하는 동안 isLoading상태가 true일때 LoadingModal컴포넌트가 표시됨 */}
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className='
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        '
      >
        <Avatar user={data} />
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <span className='absolute inset-0' aria-hidden='true' />
            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm font-medium text-gray-900'>{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
