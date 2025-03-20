import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import axios, { AxiosResponse } from "axios";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";
import UserRecordDto from "@/types/dtos/userRecordDto";
import UserModel from "@/types/models/userModel";

export default async function createUserService(user: UserRecordDto, token: string): Promise<Response<UserModel | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<UserModel> = await axiosHttp.post("/register", user, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === STATUS.CREATED) {
            return new Response<UserModel>({
                success: true,
                message: "Usuário cadastrado com sucesso!",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao cadastrar o usuário");
    } catch (error: unknown) {
        const message = "Erro inesperado ao cadastrar o usuário";
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
