import mysql from "mysql2/promise";

// YAML 파일의 environment 섹션에 정의된 변수들을 가져옵니다.
export const pool = mysql.createPool({
    host: process.env.DB_HOST || "db", // YAML의 서비스 이름
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "prgms_notes",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
