// src/utils/http.ts
import axios from "axios";
import { API_BASE_URL } from "@/settings";

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // 💡 이 옵션을 추가해야 브라우저가 쿠키(access-token)를 서버로 자동으로 보냅니다.
    withCredentials: true,
});
