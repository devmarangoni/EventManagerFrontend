import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import CustomerModel from "@/types/models/customerModel";
import axios, { AxiosResponse } from "axios";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";

export default async function getAllCustomersService(token: string): Promise<Response<CustomerModel[] | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<CustomerModel[]> = await axiosHttp.get("/customer", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === STATUS.OK) {
            return new Response<CustomerModel[]>({
                success: true,
                message: "Clientes buscados com sucesso",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao buscar todos os clientes");
    } catch (error: unknown) {
        const message = "Erro inesperado ao buscar todos os clientes";
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