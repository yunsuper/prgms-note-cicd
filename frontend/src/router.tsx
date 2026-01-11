import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { IndexPage } from "./pages/Index";
import { JoinPage } from "./pages/Join"; 
import { LoginPage } from "./pages/Login";
import { NotePage } from "./pages/Note";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            {/* 메인 페이지 */}
            <Route index Component={IndexPage} />

            {/* 회원가입/로그인 페이지 추가 */}
            <Route path="/login" Component={LoginPage} />
            <Route path="/join" Component={JoinPage} />
            <Route path="/notes" Component={NotePage} />
        </Route>
    )
);
