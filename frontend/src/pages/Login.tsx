import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 💡 Link 추가
import { httpClient } from "@/utils/http";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await httpClient.post("/users/login", { email, password });
            alert("로그인 성공!");
            navigate("/notes");
        } catch (error) {
            console.error("Login failed:", error);
            alert("로그인 실패! 이메일이나 비밀번호를 확인하세요.");
        }
    };

    return (
        <div
            style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                justifyContent: "center",
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <h1 style={{ textAlign: "center" }}>로그인</h1>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "0.8rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "0.8rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                    required
                />
                <button
                    type="submit"
                    style={{
                        cursor: "pointer",
                        padding: "0.8rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    }}
                >
                    로그인하기
                </button>
            </form>

            {/* 💡 회원가입 유도 섹션 추가 */}
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <p style={{ color: "#666", marginBottom: "0.5rem" }}>
                    계정이 없으신가요?
                </p>
                <Link
                    to="/join"
                    style={{
                        color: "#007bff",
                        textDecoration: "none",
                        fontWeight: "bold",
                    }}
                >
                    무료로 회원가입하기
                </Link>
            </div>
        </div>
    );
};
