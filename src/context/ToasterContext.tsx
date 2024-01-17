'use client'; //서버사이드에서 실행되지 않도록 지정
import { Toaster } from 'react-hot-toast';

//Toaster 컴포넌트 렌더링
const ToasterContext = () => {
  return <Toaster />;
};
export default ToasterContext;
