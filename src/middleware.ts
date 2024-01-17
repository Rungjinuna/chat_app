//next-auth라이브러리를 사용하여인증을 설정하는 방법
//withAuth 함수를 사용하여 특정 페이지에 대한 액세스를 제한
//Next.js 애플리케이션에 사용자가 특정경로에 접근하기 전에 로그인하도록 요구인증시스템을 설정
//withAuth 미들웨어는 user가 authenticated/authorized 인지 확인한다.
//승인되지않으면 login페이지로 redirect된다.

import { withAuth } from 'next-auth/middleware';

//인증을 위해 사용되는 withAuth 함수.
//로그인 페이지로 루트경로를 사용하겠다는 의미
export default withAuth({
  pages: {
    signIn: '/',
  },
});

//withAuth가 적용될 경로를 설정.
//conversation/:path*와 users/:path* 경로에 인증을 적용함.
//:path*는 모든 하위경로를 포함한다는 의미
export const config = {
  matcher: ['/conversations/:path*', '/users/:path*'],
};
