import express from "express";
const router = express.Router();

// 임시 테스트용 라우트
router.get("/", (req, res) => {
    res.send("노트 라우터 정상 작동 중!");
});

// 💡 이 부분이 반드시 있어야 '모듈'로 인식됩니다!
export default router;
