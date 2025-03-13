import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import EventModel from "@/types/models/eventModel";
import axios from "axios";
import { UUID } from "crypto";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axiosHttp from "@/lib/axios";

export default async function getActiveEventService(customerId: UUID): Promise<Response<EventModel | ErrorResponseDto>> {
    try {
        const response = await axiosHttp.get(`/event/${customerId}`);

        if (response.status === STATUS.OK) {
            const event: EventModel = response.data;
            return new Response<EventModel>({
                success: true,
                message: "Evento ativo encontrado!",
                data: event,
            });
        }

        throw new Error(response.data.message);
    } catch (error: unknown) {
        const message = "Nenhum evento ativo encontrado!";
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