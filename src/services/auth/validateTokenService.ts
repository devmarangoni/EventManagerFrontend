import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import ValidateTokenDto from "@/types/http/validateTokenDto";
import axios, { AxiosResponse } from "axios";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";

export default async function validateTokenService(body: ValidateTokenDto): Promise<Response<{ message: string } | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<{ message: string }> = await axiosHttp.post("/validate_token", body);

        if (response.status === STATUS.OK) {
            return new Response<{ message: string }>({
                success: true,
                message: "Token válido",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao validar o token");
    } catch (error: unknown) {
        const message = "Erro inesperado ao validar o token";
        const errorData: ErrorResponseDto = { message };

        if (axios.isAxiosError(error)) {
            errorData.message = error.response?.data?.message ?? message;
        } else if (error instanceof Error) {
            errorData.message = error.message;
        }

        return new Response<ErrorResponseDto>({
            success: false,
            message: errorData.message,
            data: errorData,
        });
    }
}