import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middlewares/authentication";
import { User } from "../models/user";

const usersRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// 1. POST /login
usersRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // 1. DB에서 유저 조회 (모델의 findOne 사용)
        // 💡 모델 정의에 맞춰 { email } 형태로 전달합니다.
        const user = await User.findOne({ email });
        console.log("로그인 시도 유저:", user);

        if (!user) {
            return res
                .status(401)
                .json({ message: "아이디 또는 비밀번호가 틀립니다." });
        }

        /**
         * 💡 모델 파일에서 mapToInstance를 추가했으므로
         * 이제 checkPassword 함수를 직접 호출할 수 있습니다!
         */
        const isMatch = await user.checkPassword(password);

        if (!isMatch) {
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

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error("로그인 처리 중 에러:", error);
        res.status(500).json({ message: "서버 내부 에러 발생" });
    }
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

// 3. POST / (회원가입)
usersRouter.post("/", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        await User.create({ email, password });
        res.sendStatus(201);
    } catch (error: any) {
        // 모델에서 에러가 올라올 때 처리
        if (error.code === "ER_DUP_ENTRY") {
            return res.sendStatus(409);
        }
        console.error("회원가입 에러:", error);
        res.status(500).send("서버 에러");
    }
});

export default usersRouter;
