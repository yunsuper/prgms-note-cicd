import { httpClient } from "@/utils/http";

// 1. 파라미터 타입 정의
export interface JoinParams {
    email: string;
    password: string;
}

// 2. API 호출 함수 (엔드포인트: /users)
export async function requestJoin(params: JoinParams) {
    // 강의 자료에 따라 [error, data] 구조를 지원하도록 try-catch를 씌우는 게 좋습니다.
    // (아까 useJoin 훅에서 [error]를 구조분해 할당으로 썼기 때문입니다.)
    try {
        const response = await httpClient.post("/users", params);
        return [null, response.data] as const;
    } catch (error) {
        return [error, null] as const;
    }
}
