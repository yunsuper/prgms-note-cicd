import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";

/**
 * 컴포넌트를 라우터로 감싸서 렌더링해주는 테스트 유틸리티입니다.
 * Link나 useNavigate를 사용하는 컴포넌트 테스트 시 필수입니다.
 */
export function renderWithRouter(ui: React.ReactElement, { route = "/" } = {}) {
    // 테스트 환경의 가짜 브라우저 주소를 설정합니다.
    window.history.pushState({}, "Test page", route);

    // 컴포넌트를 BrowserRouter로 감싸서 렌더링합니다.
    return render(ui, { wrapper: BrowserRouter });
}
