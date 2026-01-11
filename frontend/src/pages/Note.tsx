import React, { useEffect, useState } from "react";
import { requestNotes, NoteData } from "@/api/requestNotes";
import { httpClient } from "@/utils/http";
import "./Note.css"; // 💡 CSS 파일 임포트

export const NotePage = () => {
    const [notes, setNotes] = useState<NoteData[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchNotes = async () => {
        const [error, data] = await requestNotes();
        if (error) {
            console.error("메모를 불러오는 중 에러 발생:", error);
            return;
        }
        if (data) setNotes(data);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        try {
            await httpClient.post("/notes", { title, content });
            setTitle("");
            setContent("");
            fetchNotes();
        } catch (error) {
            console.error("저장 에러:", error);
            alert("메모 저장에 실패했습니다.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 이 메모를 삭제하시겠습니까?")) return;

        try {
            await httpClient.delete(`/notes/${id}`);
            fetchNotes();
        } catch (error) {
            console.error("삭제 중 에러 발생:", error);
            alert("메모 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="note-container">
            <h1 className="note-title">📝 나의 메모장</h1>

            <form onSubmit={handleSave} className="note-form">
                <input
                    className="note-input"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="note-textarea"
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit" className="note-submit-btn">
                    저장하기
                </button>
            </form>

            <hr className="note-divider" />

            {notes.length === 0 ? (
                <p className="note-empty-msg">작성된 메모가 없습니다.</p>
            ) : (
                <ul className="note-list">
                    {notes.map((note) => (
                        <li key={note.id} className="note-item">
                            <div className="note-content-wrapper">
                                <h3 className="note-item-title">
                                    {note.title}
                                </h3>
                                <p className="note-item-text">{note.content}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="note-delete-btn"
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
