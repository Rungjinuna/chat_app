'use client';

import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoClose, IoTrash } from 'react-icons/io5';
import { Conversation, User } from '@prisma/client';
import { format } from 'date-fns';

import useOtherUser from '@/hooks/useOtherUser';
import useActiveList from '@/hooks/useActiveList';

import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import ConfirmModal from './ConfirmModal';

interface ProfileDrawerProps {
  // 드로어가 열려있는지 여부를 나타내는 boolean값
  isOpen: boolean;
  // 드로어를 닫는 함수
  onClose: () => void;
  //대화에대한 정보와 참여자의 정보를 포함
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  // 확인 모달의 열림/닫힘 상태를 관리하는 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  //   사용자 제외 다른 사용자를 찾기위한 훅
  const otherUser = useOtherUser(data);
  // otherUser의 createdAt 값을 기반으로 한 참여 날짜 포맷팅
  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP');
  }, [otherUser.createdAt]);

  //대화 제목 계산
  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  //userActiveList에서 members를 추출해서 가져오고
  //isActive members목록에서 otherUser 이메일이 존재하는지 확인 (존재하면 IsActive true)
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  // 대화가 그룹대화인경우 참여자 수 반환, 그렇지않으면 활성상태 반환
  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-40' />
          </Transition.Child>
          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='w-screen max-w-md pointer-events-auto'>
                    <div className='flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-end'>
                          <div className='flex items-center ml-3 h-7'>
                            {/* 버튼이 들어있는 div클릭하면 onClose 함수호출 */}
                            <button
                              type='button'
                              className='text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                              onClick={onClose}
                            >
                              <span className='sr-only'>Close panel</span>
                              <IoClose size={24} aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative flex-1 px-4 mt-6 sm:px-6'>
                        <div className='flex flex-col items-center'>
                          <div className='mb-2'>
                            {/* 그룹대화이면 아바타그룹을 표시하고 그렇지않으면 아바타 표시 */}
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser} />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className='text-sm text-gray-500'>
                            {statusText}
                          </div>
                          <div className='flex gap-10 my-8'>
                            <div
                              onClick={() => setConfirmOpen(true)}
                              className='flex flex-col items-center gap-3 cursor-pointer hover:opacity-75'
                            >
                              <div className='flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100'>
                                <IoTrash size={20} />
                              </div>
                              <div className='text-sm font-light text-neutral-600'>
                                Delete
                              </div>
                            </div>
                          </div>
                          <div className='w-full pt-5 pb-5 sm:px-0 sm:pt-0'>
                            {/* dl,dd,dt는 HTML에서 정의리시트를 만들기위해 사용되는 태그 */}
                            <dl className='px-4 space-y-8 sm:space-y-6 sm:px-6'>
                              {data.isGroup && (
                                <div>
                                  <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                                    Emails
                                  </dt>
                                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                    {data.users
                                      .map((user) => user.email)
                                      .join(', ')}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <div>
                                  <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                                    Email
                                  </dt>
                                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                                      Joined
                                    </dt>
                                    <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ProfileDrawer;
