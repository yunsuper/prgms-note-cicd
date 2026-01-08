import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import usersRouter from "./users"; // 검사할 라우터를 가져옵니다.
import { MOCK_USERS } from "../models/user"; 

jest.mock("../models/user");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/users", usersRouter); // 실제 서버처럼 라우터를 연결합니다.

describe("GET /users/me", () => {
    // 테스트를 시작하기 전, 가짜 DB(MOCK_USERS)를 초기화하고 테스트 유저를 넣습니다.
    beforeEach(() => {
        MOCK_USERS.length = 0; // 배열 비우기
        MOCK_USERS.push({
            id: 1,
            email: "test@test.com",
            encryptedPassword: "hashed_password",
        });
    });

    it("올바른 쿠키가 전달되면 유저의 정보를 반환해야 한다 (200 OK)", async () => {
        const response = await request(app)
            .get("/users/me")
            // 우리가 만든 Mock JWT 규칙: "mock_jwt_" + 이메일
            .set("Cookie", ["access-token=mock_jwt_test@test.com"]);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            email: "test@test.com",
        });
    });

    it("인증 쿠키가 없으면 401 Unauthorized를 반환해야 한다", async () => {
        const response = await request(app).get("/users/me");
        expect(response.status).toBe(401);
    });

    it("잘못된 토큰 형식이면 401 Unauthorized를 반환해야 한다", async () => {
        const response = await request(app)
            .get("/users/me")
            .set("Cookie", ["access-token=invalid_token_format"]);

        expect(response.status).toBe(401);
    });
});
