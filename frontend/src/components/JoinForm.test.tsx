import { fireEvent, screen } from "@testing-library/react";
import { renderWithRouter } from "@/utils/test/renderWithRouter";
import { JoinForm } from "./JoinForm";

describe("JoinForm", () => {
    // Case 1: 모든 요소가 화면에 잘 나타나는지 확인
    test("잘 렌더링된다.", () => {
        renderWithRouter(<JoinForm />);

        expect(
            screen.getByLabelText("이메일", { selector: "input" })
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("비밀번호", { selector: "input" })
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("비밀번호 확인", { selector: "input" })
        ).toBeInTheDocument();
        expect(
            screen.getByText("가입하기", { selector: "button" })
        ).toBeInTheDocument();
        expect(
            screen.getByText("로그인하기", { selector: "a" })
        ).toBeInTheDocument();
    });

    // Case 2: 입력 후 제출 시 onSubmit 콜백이 데이터와 함께 호출되는지 확인
    test("회원정보를 입력하고 회원가입 버튼을 누르면 onSubmit 콜백이 호출된다.", () => {
        const onSubmit = jest.fn();
        renderWithRouter(<JoinForm onSubmit={onSubmit} />);

        // 데이터 입력 시뮬레이션
        fireEvent.change(screen.getByLabelText("이메일"), {
            target: { value: "foo@example.com" },
        });
        fireEvent.change(screen.getByLabelText("비밀번호"), {
            target: { value: "1234" },
        });
        fireEvent.change(screen.getByLabelText("비밀번호 확인"), {
            target: { value: "1234" },
        });

        // 버튼 클릭
        fireEvent.click(screen.getByText("가입하기"));

        // onSubmit이 올바른 인자와 함께 호출되었는지 검증
        expect(onSubmit).toBeCalledWith({
            email: "foo@example.com",
            password: "1234",
        });
    });

    // Case 3: 링크 클릭 시 URL 이동 확인
    test("로그인하기 버튼을 누르면 로그인 URL로 이동한다.", () => {
        renderWithRouter(<JoinForm />);
        fireEvent.click(screen.getByText("로그인하기"));
        expect(window.location.pathname).toBe("/login");
    });

    // Case 4: 비밀번호 불일치 시 로직 차단 확인
    test("비밀번호 확인을 다르게 입력하면 alert 창이 뜨고 onSubmit 콜백이 호출되지 않는다.", () => {
        const alertSpy = jest
            .spyOn(window, "alert")
            .mockImplementation(() => {});
        const onSubmit = jest.fn();
        renderWithRouter(<JoinForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getByLabelText("이메일"), {
            target: { value: "foo@example.com" },
        });
        fireEvent.change(screen.getByLabelText("비밀번호"), {
            target: { value: "1234" },
        });
        fireEvent.change(screen.getByLabelText("비밀번호 확인"), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByText("가입하기"));

        // alert가 호출되었는지 확인
        expect(alertSpy).toBeCalledWith("비밀번호가 일치하지 않습니다.");
        // onSubmit은 호출되지 않아야 함
        expect(onSubmit).not.toBeCalled();

        alertSpy.mockRestore(); // 모킹 복구
    });
});
