// backend/src/routes/notes.ts
import express from "express";
import { authenticateUser } from "../middlewares/authentication";
import { Note } from "../models/note";

const router = express.Router();

// 💡 authenticateUser 미들웨어를 추가하여 로그인한 사람만 접근 가능하게 합니다.
router.get("/", authenticateUser, async (req, res) => {
    const user = (req as any).user; // 미들웨어에서 넣어준 유저 정보

    try {
        // 유저 ID에 해당하는 메모들만 가져옴
        const notes = await Note.findAllByUserId(user.id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "메모 조회 중 에러 발생" });
    }
});

// 2. 💡 메모 생성 추가 (POST /notes)
router.post("/", authenticateUser, async (req, res) => {
    const { title, content } = req.body; // 프론트에서 보낸 데이터
    const user = (req as any).user;     // 인증 미들웨어에서 뽑아낸 유저 정보

    if (!title || !content) {
        return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
    }

    try {
        // Note 모델의 create 메서드를 호출 (아직 안 만드셨다면 아래에서 추가할게요!)
        await Note.create({ title, content, userId: user.id });
        res.sendStatus(201); // 성공적으로 생성됨
    } catch (error) {
        console.error("메모 저장 에러:", error);
        res.status(500).json({ message: "메모 저장 중 에러 발생" });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    const { id } = req.params;
    const user = (req as any).user;

    try {
        await Note.delete(Number(id), user.id);
        res.sendStatus(204); // 성공했으나 보낼 데이터는 없음
    } catch (error) {
        console.error("삭제 에러:", error);
        res.status(500).json({ message: "메모 삭제 중 에러 발생" });
    }
});

export default router;
