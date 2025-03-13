import CustomerRecordDto from "@/types/dtos/customerRecordDto";
import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import CustomerModel from "@/types/models/customerModel";
import axios, { AxiosResponse } from "axios";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";

export default async function createCustomerService(customer: CustomerRecordDto, token: string): Promise<Response<CustomerModel | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<CustomerModel> = await axiosHttp.post("/customer", customer, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === STATUS.CREATED) {
            return new Response<CustomerModel>({
                success: true,
                message: "Cliente cadastrado com sucesso!",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao cadastrar o cliente");
    } catch (error: unknown) {
        const message = "Erro inesperado ao cadastrar o cliente";
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
