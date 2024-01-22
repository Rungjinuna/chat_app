import clsx from 'clsx';
//Link는 Next.js의 라우팅을 위해 사용됨. 클릭시 지정된 경로로 이동
import Link from 'next/link';

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  // handleClick함수는 onClick prop이 제공될 경우 해당 함수 호출
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    // Link컴포넌트 사용하여 네비게이션 항목 렌더링.
    <Link
      // Link컴포넌트 클릭할때 handleClick함수 호출
      onClick={handleClick}
      href={href}
      //active 상태에 따라 다른 스타일 적용. true이면 배경화면과 text색상 변경
      className={clsx(
        `group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100`,
        active && 'bg-gray-100 text-black'
      )}
    >
      <Icon className='h-6 w-6' />
    </Link>
  );
};

export default MobileItem;
