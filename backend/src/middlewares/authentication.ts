import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// 테스트 시에는 src/models/__mocks__/user.ts 를 참조하게 됩니다.
import { User } from "../models/user";

export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 1. 쿠키에서 access-token 꺼내기 (강의 명세에 따라 하이픈 확인)
    const accessToken = req.cookies?.["access-token"];
    if (!accessToken) return res.sendStatus(401);

    try {
        // 2. JWT 검증 (우리가 만든 Mock의 verify가 작동함)
        jwt.verify(accessToken, "secret");

        // 3. 토큰에서 이메일 정보 추출 (Mock의 decode 사용)
        const decoded = jwt.decode(accessToken) as { email: string };

        // 4. DB(혹은 Mock)에서 사용자 정보 가져오기
        const user = await User.findOne({ email: decoded.email });

        // 사용자가 존재하지 않으면 인증 실패
        if (!user) {
            return res.sendStatus(401);
        }

        // 5. Request 객체에 유저 정보 저장 (다른 라우터에서 쓸 수 있게)
        (req as any).user = user;

        next();
    } catch (e) {
        // 토큰이 위조되었거나 만료된 경우
        res.sendStatus(401);
    }
}
