// src/pages/Join.template.tsx
import React, { useState } from "react";
import styled from "styled-components";
import oc from "open-color";

export interface JoinTemplateProps {
    onSubmit: (data: {
        email: string;
        password: string;
    }) => Promise<void> | void;
}

export const JoinTemplate: React.FC<JoinTemplateProps> = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            return alert("비밀번호가 일치하지 않습니다.");
        }
        onSubmit({ email, password });
    };

    return (
        <Container>
            <Title>회원가입</Title>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <SubmitButton type="submit">가입하기</SubmitButton>
            </Form>
        </Container>
    );
};

// 간단한 스타일링
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
`;

const Title = styled.h1`
    color: ${oc.gray[8]};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
`;

const Input = styled.input`
    padding: 0.5rem;
    border: 1px solid ${oc.gray[4]};
    border-radius: 4px;
`;

const SubmitButton = styled.button`
    padding: 0.7rem;
    background: ${oc.blue[6]};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: ${oc.blue[7]};
    }
`;
