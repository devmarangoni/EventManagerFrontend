import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import EventModel from "@/types/models/eventModel";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axios, { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosHttp from "@/lib/axios";

export default async function getActiveEventScheduleByCustomerService(
    customerId: UUID,
    token: string
): Promise<Response<EventModel | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<EventModel> = await axiosHttp.get(
            `/schedule/customer/${customerId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === STATUS.OK) {
            return new Response<EventModel>({
                success: true,
                message: "Evento ativo do cliente obtido",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao obter o evento ativo do cliente");
    } catch (error: unknown) {
        const message = "Erro ao obter o evento ativo do cliente";
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