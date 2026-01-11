// src/api/requestJoin.ts

import { httpClient } from "@/utils/http";

export interface JoinParams {
    email: string;
    password: string;
}

export async function requestJoin(params: JoinParams) {
    try {
        const response = await httpClient.post("/users", params);
        console.log("서버 응답:", response);
        return [null, response.data] as const;
    } catch (error) {
        return [error, null] as const;
    }
}
