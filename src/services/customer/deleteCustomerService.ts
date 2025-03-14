import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import axios, { AxiosResponse } from "axios";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";
import { UUID } from "crypto";

export default async function deleteCustomerService(customerId: UUID, token: string): Promise<Response<{ message: string } | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<{ message: string }> = await axiosHttp.delete(`/customer/${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === STATUS.OK) {
            return new Response<{ message: string }>({
                success: true,
                message: "Cliente excluido com sucesso!",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao excluir o cliente");
    } catch (error: unknown) {
        const message = "Erro inesperado ao excluir o cliente";
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