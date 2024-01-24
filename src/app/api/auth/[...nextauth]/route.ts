import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/libs/prismadb';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), //Prisma를 사용하여 데이터 관리
  providers: [
    //Github 인증 제공자 설정
    GithubProvider({
      clientId: process.env.GITHUB_ID as string, //환경변수에서 Github클라이언트 ID를 가져옴
      clientSecret: process.env.GITHUB_SECRET as string, //환경변수에서 Github 클라이언트 비밀번호를 가져옴
    }),
    //Google 인증 제공자 설정
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    //이메일과 비밀번호를 사용하여 사용자 인증. 사용자가 입력한 크리덴셜을 데이터베이스에 저장된 정보와 비교하여 인증과정 처리
    //자체 인증 시스템을 위한 설정
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' }, //email필드설정
        password: { label: 'password', type: 'password' }, //password필드설정
      },
      //사용자 인증과정
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }
        //Prisma를 사용하여 데이터베이스에서 사용자 검색
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email, //제공된 이메일로 사용자 검색
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }
        //bcrypt 사용하여 제공된 비밀번호와 저장된 해시된 비밀번호 비교
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }
        //인증이 성공한 경우 사용자 객체 반환
        return user;
      },
    }),
  ],
  //개발환경에서 디버그 모드 활성화
  debug: process.env.NODE_ENV !== 'development',
  session: {
    strategy: 'jwt', //세션 관리 전략으로 Json Web Token 사용
  },
  secret: process.env.NEXTAUTH_SECRET, //세션 암호화위한 비밀키
};
//인증핸들러 = NextAuth 함수에 authOptions를 전달하여 인증핸들러 생성. (Next.js API라우트에서 사용됨)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; //HTTP GET 및 POST 요청을 처리하기 위해 핸들러 내보내기
