import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// 로그인 로직(users.ts)에서 사용하는 비밀키와 반드시 일치해야 합니다.
const JWT_SECRET = "super-secret-key";

export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 1. 쿠키에서 access-token 꺼내기
    const accessToken = req.cookies?.["access-token"];

    if (!accessToken) {
        console.log("인증 실패: 쿠키에 토큰이 없음");
        return res.sendStatus(401);
    }

    try {
        // 2. JWT 검증 (위에서 정의한 JWT_SECRET 변수를 사용해야 합니다)
        const decoded = jwt.verify(accessToken, JWT_SECRET) as {
            email: string;
        };

        // 3. DB(혹은 Mock)에서 사용자 정보 가져오기
        const user = await User.findOne({ email: decoded.email });

        // 사용자가 존재하지 않으면 인증 실패
        if (!user) {
            console.log(`인증 실패: ${decoded.email} 사용자를 찾을 수 없음`);
            return res.sendStatus(401);
        }

        // 4. Request 객체에 유저 정보 저장
        (req as any).user = user;

        next();
    } catch (e) {
        console.error("인증 에러:", e);
        res.sendStatus(401);
    }
}
