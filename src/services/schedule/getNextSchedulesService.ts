import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axios, { AxiosResponse } from "axios";
import { UUID } from "crypto";
import axiosHttp from "@/lib/axios";

export default async function getNextSchedulesService(
    customerId: UUID
): Promise<Response<Date[] | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<Date[]> = await axiosHttp.get(
            `/schedule/events/next?customer=${customerId}`
        );

        if (response.status === STATUS.OK) {
            return new Response<Date[]>({
                success: true,
                message: "Datas dos dias ocupados foram obtidas",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao obter os dias ocupados com agendamento");
    } catch (error: unknown) {
        const message = "Não foi possível obter os dias ocupados com agendamento";
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