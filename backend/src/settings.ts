import dotenv from "dotenv";

dotenv.config();

// 1. 객체 형태로 내보내기 (기존 스타일 유지 + DB 설정 추가)
export const settings = {
    port: parseInt(process.env.PORT || "3031", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:30030",

    // 데이터베이스 설정 추가
    dbHost: process.env.DB_HOST || "notes-db",
    dbUser: process.env.DB_USER || "prgms",
    dbPassword: process.env.DB_PASSWD || "prgms", // ConfigMap의 DB_PASSWD와 매핑
    dbName: process.env.DB_NAME || "prgms_notes",
    dbPort: parseInt(process.env.DB_PORT || "3306", 10), // 기본값 3306 이용
};

// 2. 개별 변수로도 내보내기 (강의 및 기존 코드 대응)
export const PORT = settings.port;
export const CORS_ALLOWED_ORIGIN = settings.corsOrigin;

// DB 관련 개별 변수 추가 내보내기
export const DB_HOST = process.env.DB_HOST || "127.0.0.1";
// export const DB_HOST = settings.dbHost;
export const DB_USER = settings.dbUser;
export const DB_PASSWORD = settings.dbPassword;
export const DB_NAME = settings.dbName;
export const DB_PORT = settings.dbPort; //
