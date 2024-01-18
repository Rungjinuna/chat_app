import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/libs/prismadb';

//비동기 POST함수, request라는 HTTP요청 객체를 인자로 받음
//요청 본문에서 email, name, password를 추출함
export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  //bcrypt로 비밀번호 해시, 솔트라운드로 12사용
  const hashedPassword = await bcrypt.hash(password, 12);
  //prisma.user.create를 사용하여 새 사용자를 데이터베이스에 생성함
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
  //생성된 사용자 정보를 JSON형태로 응답
  return NextResponse.json(user);
}
