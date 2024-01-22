const EmptyState = () => {
  return (
    <div className='flex items-center justify-center h-full px-4 py-10 bg-gray-100  sm:px-6 lg:px-8 lg:py-6'>
      <div className='flex flex-col items-center text-center'>
        <h3 className='mt-2 text-2xl font-semibold text-gray-900'>
          채팅을 선택하거나 새 대화를 시작하세요
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
