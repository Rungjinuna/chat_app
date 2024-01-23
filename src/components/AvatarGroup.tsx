//사용자 아바타(프로필이미지)를 그룹으로 표시하는데 사용됨
'use client';

import { User } from '@prisma/client';
import Image from 'next/image';

interface AvatarGroupProps {
  users?: User[];
}

// 기본 Props값 설정 : users=[]는 users prop이 전달되지 않을 경우
//기본적으로 빈 배열을 사용하도록 설정
const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  //사용자 배열에서 최대 3명의 사용자만 선택하여 slicedUsers에 저장함
  const slicedUsers = users.slice(0, 3);
  // 아바다 스위치 매핑
  // positionMap 객체는 각 아바타의 CSS위치를 지정함
  // 배열의 인덱스 (0,1,2)에 따라 다른 위치 스타일 적용함
  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0',
  };

  //UI 렌더링
  return (
    <div className='relative h-11 w-11'>
      {/* slicedUser.map으로
      각 사용자에 대한 아바타를 렌더링함 */}
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `}
          // TypeScript에서 사용되는 표현방식,
          // positionMap 객체에서 특정 인덱스에 해당하는 CSS클래스이름을 동적으로 추출하기위해 사용됨
          // positionMap은 각 인덱스에 해당하는 CSS위치 스타일을 정의한 객체
          // index as keyof typeof positionMap : TypeScript의 타입 캐스팅사용
          // index는 숫자이지만 positionMap의 키는 문자열타입
          // 따라서 index를 positionMap의 키 타입으로 캐스팅하여 객체에서 올바른 값을 찾을 수 있도록 함
        >
          <Image
            fill
            src={user?.image || '/images/placeholder.jpg'}
            alt='Avatar'
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;

//AvatarGroup 컴포넌트는 그룹 대화에서 최대 3명의 사용자 까지의 프로필 사진을 표시함
// 각 사용자의 프로필 사진은 사용자가 가진 image 속성에 따라 다르게 나타남
// 아바타의 위치는 인덱스에 따라 다르게 설정되어서 겹치지않고 시각적으로 구분될 수있게함
