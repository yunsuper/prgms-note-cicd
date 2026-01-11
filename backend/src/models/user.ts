// backend/src/models/user.ts
import { pool } from "../utils/db";

export class User {
    id!: number;
    email!: string;
    encryptedPassword!: string;

    // 실제 DB에서 유저 찾기
    static async findOne(params: { email: string }): Promise<User | null> {
        const [rows]: any = await pool.execute(
            "SELECT id, email, encrypted_password AS encryptedPassword FROM users WHERE email = ?",
            [params.email]
        );

        return rows.length > 0 ? (rows[0] as User) : null;
    }

    // 실제 DB에 유저 생성
    static async create(params: {
        email: string;
        password: string;
    }): Promise<void> {
        await pool.execute(
            "INSERT INTO users (email, encrypted_password) VALUES (?, ?)",
            [params.email, params.password]
        );
    }
}
