// src/router.tsx
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { IndexPage } from "./pages/Index"; // IndexPage 파일이 해당 위치에 있어야 합니다.

export const router = createBrowserRouter(
    createRoutesFromElements(
        // index는 path="/"와 같은 의미입니다.
        // Component={IndexPage}는 해당 주소에서 보여줄 컴포넌트를 지정합니다.
        <Route index Component={IndexPage} />
    )
);
