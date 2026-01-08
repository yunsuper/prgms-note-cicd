import "@testing-library/jest-dom";

// 브라우저에만 있는 alert 함수를 테스트 환경(Node.js)에서 사용할 수 있게 가짜로 만듭니다.
Object.defineProperty(window, "alert", {
    writable: true,
    value: jest.fn(),
});
