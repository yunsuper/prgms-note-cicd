import { pool } from "../utils/db";

export class Note {
    id!: number;
    userId!: number;
    title!: string;
    content!: string;
    createdAt?: Date;

    /**
     * 특정 사용자의 모든 메모를 최신순으로 가져옵니다.
     */
    static async findAllByUserId(userId: number): Promise<Note[]> {
        console.log(`[DB Query] 유저 ID: ${userId}의 메모 목록 조회`);

        const [rows]: any = await pool.execute(
            "SELECT id, user_id AS userId, title, content, created_at AS createdAt FROM notes WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        return rows as Note[];
    }

    /**
     * 특정 메모의 상세 정보를 가져옵니다.
     */
    static async findOne(params: { id: number }): Promise<Note | null> {
        const [rows]: any = await pool.execute(
            "SELECT id, user_id AS userId, title, content, created_at AS createdAt FROM notes WHERE id = ?",
            [params.id]
        );

        return rows.length > 0 ? (rows[0] as Note) : null;
    }

    /**
     * 새로운 메모를 DB에 저장합니다.
     */
    static async create(params: {
        title: string;
        content: string;
        userId: number;
    }): Promise<void> {
        console.log(`[DB Insert] 유저 ID: ${params.userId}의 새 메모 저장`);

        await pool.execute(
            "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)",
            [params.title, params.content, params.userId]
        );
    }

    static async delete(id: number, userId: number): Promise<void> {
        // 본인의 메모만 삭제할 수 있도록 userId를 함께 확인합니다.
        await pool.execute("DELETE FROM notes WHERE id = ? AND user_id = ?", [
            id,
            userId,
        ]);
    }
}
