import EventRecordDto from "@/types/dtos/eventRecordDto";
import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import EventModel from "@/types/models/eventModel";
import axios, { AxiosResponse } from "axios";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";

export default async function createEventService(event: EventRecordDto, token: string): Promise<Response<EventModel | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<EventModel> = await axiosHttp.post("/event", event, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === STATUS.CREATED) {
            return new Response<EventModel>({
                success: true,
                message: "Evento cadastrado com sucesso",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao cadastrar o evento");
    } catch (error: unknown) {
        const message = "Erro inesperado ao cadastrar evento";
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