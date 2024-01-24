import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// 서버측 푸셔 인스턴스생성
// 메세지를 푸시하고 채널을 관리하는데 사용됨
// 환경변수 : appId, key, secret등은 환경 변수에서 가져옴.
// 이들은 푸셔 서비스를 사용하기 위한 인증 정보임
// cluster는 푸셔 서비스의 클러스터를 지정함
// useTLS : TLS 전송계층보안을 사용하여 보안 통신 활성화
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'ap3',
  useTLS: true,
});

// 클라이언트측 푸셔 인스턴스 생성, 실시간으로 데이터를 받기 위해 서버와 통신함
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    // channelAuthorization 푸셔 채널에 접근하기 위한 인증 엔드포인트를 저장함
    // 여기서 api.pusher/auth는 클라이언트가 채널에 접근할 때 인증을 처리하는 서버측 경로
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      // 인증방식으로 ajax를 사용함
      transport: 'ajax',
    },
    cluster: 'ap3',
  }
);
