// src/hooks/useJoin.ts
import { useMutation } from "@tanstack/react-query"; // useQueryClient는 필요 없으니 삭제
import { isAxiosError } from "axios";
import { requestJoin, JoinParams } from "@/api/requestJoin";

export const useJoin = () => {
    // const queryClient = useQueryClient();

    const joinMutation = useMutation({
        mutationFn: async (params: JoinParams) => {
            const [error] = await requestJoin(params);

            if (isAxiosError(error) && error.response?.status === 409) {
                return { result: "conflict" as const };
            }

            if (error) {
                throw error;
            }

            return { result: "success" as const };
        },
    });

    return { join: joinMutation.mutateAsync };
};
