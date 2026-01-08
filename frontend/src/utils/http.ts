// src/utils/http.ts
import axios from "axios";
import { API_BASE_URL } from "@/settings";

// 강의에서 사용하는 이름인 httpClient로 변경
export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
