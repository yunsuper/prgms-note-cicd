// backend/src/utils/db.ts 수정본
import mysql from "mysql2/promise";
// 💡 settings.ts에서 가공된 변수를 가져옵니다.
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from "../settings";

export const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD, // 💡 settings.ts에서 DB_PASSWD를 넘겨주므로 안전함
    database: DB_NAME,
    port: DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
