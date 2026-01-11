// backend/scripts/hashExistingPasswords.ts
import { pool } from "../src/utils/db";
import bcrypt from "bcrypt";

async function hashExistingPasswords() {
    // 1. 모든 유저 가져오기
    const [users]: any = await pool.execute(
        "SELECT id, email, encrypted_password FROM users"
    );

    for (const user of users) {
        const { id, encrypted_password } = user;

        // 이미 해시된 비밀번호는 건너뛰기 (bcrypt는 $2b$로 시작)
        if (!encrypted_password.startsWith("$2b$")) {
            const hashed = await bcrypt.hash(encrypted_password, 10);
            await pool.execute(
                "UPDATE users SET encrypted_password = ? WHERE id = ?",
                [hashed, id]
            );
            console.log(`User ${user.email} password hashed`);
        }
    }

    console.log("All existing passwords hashed.");
    process.exit(0);
}

hashExistingPasswords().catch(console.error);
