import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.status(204).send(); // 내용 없이 204 응답만 보내서 생존 신고
});

export default router;
