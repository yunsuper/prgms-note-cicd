// src/models/user.ts
export class User {
    id!: number;
    email!: string;
    encryptedPassword!: string;

    static async findOne(params: { email: string }): Promise<User | null> {
        return null; // 실제 구현은 나중에!
    }
}

// 타입스크립트 에러 방지를 위해 실제 파일에도 export를 추가합니다.
export const MOCK_USERS: User[] = [];
