import { Request, Response, NextFunction } from "express";
import { Note } from "../models/note"; // 실제 모델 경로

export async function authorizeNote(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;
    const user = (req as any).user; // authenticateUser에서 담아준 유저 정보

    try {
        // 1. DB(혹은 Mock)에서 id에 해당하는 Note 조회
        const note = await Note.findOne({ id: Number(id) });

        // 2. Note가 없으면 404 (Not Found)
        if (!note) {
            return res.sendStatus(404);
        }

        // 3. Note.userId와 현재 로그인한 사용자의 id가 다르면 403 (Forbidden)
        // (강의 설계상의 필드명 user_id 혹은 userId를 확인하세요)
        if (note.userId !== user.id) {
            return res.sendStatus(403);
        }

        // 4. 일치하면 req.note에 저장하여 다음 라우터에서 사용 가능하게 함
        (req as any).note = note;
        next();
    } catch (e) {
        res.sendStatus(500); // 서버 에러 처리
    }
}
