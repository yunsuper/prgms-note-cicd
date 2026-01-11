// 전역 변수 타입 선언 (TypeScript 사용 시)
declare global {
    interface Window {
        _ENV: { [key: string]: string };
    }
}

export const API_BASE_URL =
    (window._ENV && window._ENV.REACT_APP_API_BASE_URL) ||
    "http://localhost:3031";
