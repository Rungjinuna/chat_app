import clsx from 'clsx';
import Link from 'next/link';

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  // 항목이 클릭될때 호출되는 handleClick함수를 포함.
  //onClick함수가 제공되면 해당함수를 실행함
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick} key={label}>
      <Link
        href={href}
        // active 상태에 따라 조건부 스타일링
        className={clsx(
          `
            group 
            flex 
            gap-x-3 
            rounded-md 
            p-3 
            text-sm 
            leading-6 
            font-semibold 
            text-gray-500 
            hover:text-black
            bg-white 
            hover:bg-gray-100
          `,
          active && 'bg-gray-200 text-black'
        )}
      >
        <Icon className='w-6 h-6 shrink-0' aria-hidden='true' />
        <span className='sr-only'>{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
