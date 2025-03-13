import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import EventModel from "@/types/models/eventModel";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axios, { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosHttp from "@/lib/axios";

export default async function getActiveEventService(
    customerId: UUID,
    token: string
): Promise<Response<EventModel[] | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<EventModel[]> = await axiosHttp.get(
            `/events/${customerId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === STATUS.OK) {
            return new Response<EventModel[]>({
                success: true,
                message: "Eventos do cliente encontrados!",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao obter eventos do cliente");
    } catch (error: unknown) {
        const message = "Erro inesperado ao obter eventos do cliente";
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