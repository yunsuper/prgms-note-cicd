import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router"; // 이 파일은 바로 다음 단계에서 만들 거예요!
import "./App.css";

// 1. React Query 클라이언트 생성 (기존에는 없던 부분)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0,
        },
    },
});

export const App: React.FC = () => {
    return (
        // 2. 서버 데이터를 관리하는 QueryClientProvider로 감싸기
        <QueryClientProvider client={queryClient}>
            {/* 3. 라우팅을 담당하는 RouterProvider로 교체 (BrowserRouter 대신) */}
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
