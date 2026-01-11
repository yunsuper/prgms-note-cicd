import { httpClient } from "@/utils/http";

export interface NoteData {
    id: number;
    title: string;
    content: string;
}

export async function requestNotes() {
    try {
        const response = await httpClient.get<NoteData[]>("/notes");
        return [null, response.data] as const;
    } catch (error) {
        return [error, null] as const;
    }
}

export const createNote = async (title: string, content: string) => {
    try {
        const response = await httpClient.post("/notes", { title, content });
        return [null, response.data];
    } catch (error) {
        return [error, null];
    }
};