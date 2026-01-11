// backend/src/routes/users.ts

import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middlewares/authentication";
import { User } from "../models/user"; // 모델만 가져와서 사용 (중복 선언 금지)

const usersRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// 1. POST /login
usersRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. DB에서 유저 조회 (아까 만든 User 모델 활용)
    const user = await User.findOne({ email });
    console.log("로그인 시도 유저:", user);

    // 2. 유저가 없거나 비밀번호가 틀린 경우 (현재는 단순 비교)
    if (!user || user.encryptedPassword !== password) {
        return res
            .status(401)
            .json({ message: "아이디 또는 비밀번호가 틀립니다." });
    }

    // 3. 토큰 발행 및 쿠키 설정
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "14d" }
    );

    res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 14,
        path: "/",
    });

    res.sendStatus(204);
});

// 2. GET /me
usersRouter.get(
    "/me",
    authenticateUser,
    async (req: Request, res: Response) => {
        const user = (req as any).user;
        res.json({ id: user.id, email: user.email });
    }
);

// 3. POST / (회원가입) - 프론트엔드에서 /users 로 요청 시 실행됨
usersRouter.post("/", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        await User.create({ email, password });
        res.sendStatus(201);
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") return res.sendStatus(409);
        res.status(500).send("서버 에러");
    }
});

export default usersRouter;
