//next-auth 라이브러리를 사용하여 인증상태를 관리하는 AuthContext 컴포넌트
//주로 애플리케이션 최상위 레벨에서 사용되어 모든 하위 컴포넌트들이 next-auth의 인증상태에 접근할 수 있도록해줌
//SessionProvider의 사용은 next-auth를 통해 인증된 사용자의 세션 정보를 관리하고
//이를 애플리케이션의 다른 부분에서 활용할 수 있도록 해줌
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  //SessionProvider 컴포넌트를 사용하여 자식 컴포넌트들에게 인증상태를 제공함
  return <SessionProvider>{children}</SessionProvider>;
}
