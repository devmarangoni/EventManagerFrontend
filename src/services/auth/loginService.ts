import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import LoginResponseDto from "@/types/http/loginResponseDto";
import axiosHttp from "@/lib/axios";
import axios, { AxiosResponse } from "axios";
import LoginTO from "@/types/http/loginTO";
import ErrorResponseDto from "@/types/http/errorResponseDto";

export default async function loginService(login: LoginTO): Promise<Response<LoginResponseDto | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<LoginResponseDto> = await axiosHttp.post("/login", login);

        if (response.status === STATUS.OK) {
            return new Response<LoginResponseDto>({
                success: true,
                message: "Login realizado com sucesso",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao realizar login");
    } catch (error: unknown) {
        const message = "Erro inesperado ao realizar login";
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