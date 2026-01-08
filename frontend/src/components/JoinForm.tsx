import React, { useState } from "react";
import styled from "styled-components";
import oc from "open-color";
import { Link } from "react-router-dom"; // 1. 링크 이동 테스트를 위해 추가

export interface JoinFormProps {
    onSubmit?(e: { email: string; password: string }): void;
}

export const JoinForm: React.FC<JoinFormProps> = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    return (
        <Container>
            <Title>회원가입</Title>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (password !== passwordConfirm) {
                        return alert("비밀번호가 일치하지 않습니다.");
                    }
                    props.onSubmit?.({ email, password });
                }}
            >
                <InputContainer>
                    {/* 2. label과 id를 연결해줘야 getByLabelText가 작동합니다 */}
                    <Label htmlFor="email">이메일</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Label htmlFor="password-confirm">비밀번호 확인</Label>
                    <Input
                        id="password-confirm"
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </InputContainer>

                <SubmitButton type="submit">가입하기</SubmitButton>

                {/* 3. 이동 테스트를 위해 '로그인하기' 링크 추가 */}
                <StyledLink to="/login">로그인하기</StyledLink>
            </Form>
        </Container>
    );
};

// --- 스타일링 추가/수정 ---
const Label = styled.label`
    font-size: 0.9rem;
    font-weight: bold;
    color: ${oc.gray[7]};
    margin-top: 0.5rem;
`;

const StyledLink = styled(Link)`
    text-align: center;
    color: ${oc.blue[6]};
    text-decoration: none;
    font-size: 0.9rem;
    &:hover {
        text-decoration: underline;
    }
`;

// 기존 스타일은 그대로 유지...
const Container = styled.div`
    padding: 2rem;
    background: white;
    border: 1px solid ${oc.gray[3]};
    border-radius: 8px;
`;
const Title = styled.h2`
    margin-bottom: 2rem;
    color: ${oc.gray[8]};
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;
const Input = styled.input`
    padding: 0.8rem;
    border: 1px solid ${oc.gray[4]};
    border-radius: 4px;
`;
const SubmitButton = styled.button`
    background: ${oc.blue[6]};
    color: white;
    padding: 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: ${oc.blue[7]};
    }
`;
