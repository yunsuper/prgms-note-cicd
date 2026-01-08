import dotenv from "dotenv";

dotenv.config();

// 1. 객체 형태로 내보내기 (기존 스타일 유지)
export const settings = {
    port: parseInt(process.env.PORT || "3031", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
};

// 2. 개별 변수로도 내보내기 (강의의 import { PORT } 대응)
export const PORT = settings.port;
export const CORS_ALLOWED_ORIGIN = settings.corsOrigin;
