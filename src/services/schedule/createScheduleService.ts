import ScheduleRecordDto from "@/types/dtos/scheduleRecordDto";
import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import ScheduleModel from "@/types/models/scheduleModel";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axios, { AxiosResponse } from "axios";
import axiosHttp from "@/lib/axios";

export default async function createScheduleService(
    schedule: ScheduleRecordDto,
    token: string
): Promise<Response<ScheduleModel | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<ScheduleModel> = await axiosHttp.post(
            "/schedule",
            schedule,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === STATUS.CREATED) {
            return new Response<ScheduleModel>({
                success: true,
                message: "Evento agendado com sucesso",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao agendar evento");
    } catch (error: unknown) {
        const message = "Erro inesperado ao agendar evento";
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