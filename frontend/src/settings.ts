// 전역 변수 타입 선언
declare global {
    interface Window {
        _ENV: { [key: string]: string | undefined };
    }
}

/**
 * 💡 k8s 배포 환경 설정
 * 1. 우선적으로 docker-entrypoint.sh가 생성한 window._ENV 객체를 확인합니다.
 * 2. 값이 없다면 빌드 시점의 process.env를 확인합니다.
 * 3. 로컬 테스트 배포 환경의 기본 주소인 http://localhost:30031을 기본값으로 사용합니다.
 */
const { REACT_APP_API_BASE_URL: API_BASE_URL = "http://localhost:30031" } =
    (window as any)._ENV ?? process.env;

export { API_BASE_URL };
