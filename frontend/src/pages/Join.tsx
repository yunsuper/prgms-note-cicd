// src/pages/Join.tsx 수정
import React from "react";
import { useNavigate } from "react-router-dom";
import { useJoin } from "@/hooks/useJoin";
// 1. 확장자까지 명시하거나 파일명을 다시 확인하세요 (대소문자 주의!)
import { JoinTemplate, JoinTemplateProps } from "./Join.template";

export const JoinPage = () => {
    const navigate = useNavigate();
    const { join } = useJoin();

    // 2. 타입을 명시적으로 지정하여 'any' 에러를 해결합니다.
    const handleSubmit: JoinTemplateProps["onSubmit"] = async ({
        email,
        password,
    }) => {
        const response = await join({ email, password });

        if (response.result === "conflict") {
            return alert("이미 가입된 이메일입니다.");
        }

        alert("회원가입이 완료되었습니다.");
        navigate("/login");
    };

    return <JoinTemplate onSubmit={handleSubmit} />;
};
