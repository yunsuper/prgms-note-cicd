// src/models/note.ts
export class Note {
    id!: number;
    userId!: number;
    title!: string;
    content!: string;

    static async findOne(params: { id: number }): Promise<any> {
        return null; // 실제 구현은 나중에!
    }
}
