import clsx from 'clsx';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode; //버튼 내부에 표시될 내용
  onClick?: () => void;
  secondary?: boolean; //보조 스타일 적용할지 여부
  danger?: boolean; //위험 또는 경고버튼으로 스타일 할지 여부결정
  disabled?: boolean; //버튼이 비활성화 될지 여부
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `
        flex 
        justify-center 
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold 
        focus-visible:outline 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        `,
        disabled && 'opacity-50 cursor-default',
        fullWidth && 'w-full',
        secondary ? 'text-gray-900' : 'text-white',
        danger &&
          'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary &&
          !danger &&
          'bg-orange-500 hover:bg-orange-600 focus-visible:outline-orange-600'
      )}
    >
      {children}
    </button>
  );
};

export default Button;
