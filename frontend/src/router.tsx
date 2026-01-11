import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { IndexPage } from "./pages/Index";
import { JoinPage } from "./pages/Join"; // JoinPage 컴포넌트를 임포트합니다.

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            {/* 메인 페이지 */}
            <Route index Component={IndexPage} />

            {/* 회원가입/로그인 페이지 추가 */}
            <Route path="/login" Component={JoinPage} />
            <Route path="/join" Component={JoinPage} />
        </Route>
    )
);
