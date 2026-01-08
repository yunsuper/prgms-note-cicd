import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middlewares/authentication";
import { settings } from "../settings";

const usersRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// 1. POST /login - 로그인 및 JWT 발급
usersRouter.post("/login", async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // 테스트 시에는 우리가 만든 Mock의 sign이 작동합니다.
    const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "14d" });

    res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    });

    res.sendStatus(204);
});

// 2. GET /users/me - 내 정보 조회 (테스트의 핵심 대상!)
// authenticateUser 미들웨어를 통과해야만 실행됩니다.
usersRouter.get("/me", authenticateUser, async (req: Request, res: Response) => {
    // authenticateUser에서 req.user에 유저 정보를 담아줬으므로 바로 사용 가능합니다.
    const user = (req as any).user;
    
    // 내 정보를 응답합니다.
    res.json({
        id: user.id,
        email: user.email
    });
});

// 3. POST /users - 회원가입 (유저 생성)
usersRouter.post("/", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // TODO: User 모델과 에러 유틸리티가 준비되면 주석을 해제하세요.
    /*
    try {
        await User.create({ email, password });
    } catch (error) {
        if (isQueryError(error) && error.code === "ER_DUP_ENTRY") {
            return res.sendStatus(409);
        }
        throw error;
    }
    res.sendStatus(201);
    */
    // 임시 응답 (서버가 죽지 않게 확인용)
    res.sendStatus(201);
});

// 4. POST /logout - 로그아웃
usersRouter.post("/logout", async (req, res) => {
    res.clearCookie("access-token");
    res.sendStatus(204);
});

export default usersRouter;
