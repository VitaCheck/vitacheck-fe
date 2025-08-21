// src/types/kakao.d.ts

declare global {
  interface Window {
    Kakao: any; // 기본 공유 기능만 사용할 경우 any로 충분
  }
}

export {};
