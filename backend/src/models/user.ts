import { pool } from "../utils/db";
import bcrypt from "bcrypt";

export class User {
    id!: number;
    email!: string;
    encryptedPassword!: string;

    // 💡 클래스 인스턴스로 변환하는 헬퍼 함수
    private static mapToInstance(row: any): User {
        const user = new User();
        user.id = row.id;
        user.email = row.email;
        user.encryptedPassword = row.encryptedPassword;
        return user;
    }

    // DB에서 유저 찾기
    static async findOne(params: { email: string }): Promise<User | null> {
        const [rows]: any = await pool.execute(
            "SELECT id, email, encrypted_password AS encryptedPassword FROM users WHERE email = ?",
            [params.email]
        );

        // 💡 단순히 (rows[0] as User)로 캐스팅하는 것이 아니라,
        // new User()를 통해 인스턴스를 생성해서 리턴해야 함수를 쓸 수 있습니다.
        return rows.length > 0 ? this.mapToInstance(rows[0]) : null;
    }

    // DB에 유저 생성 (비밀번호 암호화 포함)
    static async create(params: {
        email: string;
        password: string;
    }): Promise<void> {
        const hashedPassword = await bcrypt.hash(params.password, 10);
        await pool.execute(
            "INSERT INTO users (email, encrypted_password) VALUES (?, ?)",
            [params.email, hashedPassword]
        );
    }

    // 로그인 시 비밀번호 검증
    async checkPassword(password: string): Promise<boolean> {
        // 이제 인스턴스 메서드로 정상 작동합니다.
        return await bcrypt.compare(password, this.encryptedPassword);
    }
}
