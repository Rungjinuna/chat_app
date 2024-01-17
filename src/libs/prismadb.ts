//Prisma Client import
//Prisma Client는 데이터베이스와의 상호작용을 위한 주요 인터페이스
import { PrismaClient } from '@prisma/client';

//글로벌 네임스페이스 선언
//전역 타입스크립트 네임스페이스에 prisma라는 변수 선언. 이 변수는 prismaClient타입, 또는 undefined
//Prisma client 인스턴스를 전역적으로 사용하기 위한 준비단계
declare global {
  var prisma: PrismaClient | undefined;
}

//Prisma client생성
//globalThis.prisma가 이미 존재하면 그것을 사용하고 그렇지 않으면 새로운 PrismaClient 인스턴스 생성.
const client = globalThis.prisma || new PrismaClient();

//Prisma client 인스턴스 캐싱
//NODE_ENV가 production이 아닐때만(개발환경에서만) PrismaClient 인스턴스를 전역 객체에 할당함.
//개발환경에서는 이러한 전역캐싱을 사용하지 않음.
//이는 개발 중에 서버를 재시작할 떄마다 새로운 Prisma Client 인스턴스를 생성하는 것을 방지. 리소스 최적화
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;
export default client;
