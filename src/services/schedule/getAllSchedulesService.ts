import Response from "@/types/http/response";
import STATUS from "@/types/http/status";
import ScheduleModel from "@/types/models/scheduleModel";
import ErrorResponseDto from "@/types/http/errorResponseDto";
import axios, { AxiosResponse } from "axios";
import axiosHttp from "@/lib/axios";

export default async function getAllSchedulesService(
    token: string
): Promise<Response<ScheduleModel[] | ErrorResponseDto>> {
    try {
        const response: AxiosResponse<ScheduleModel[]> = await axiosHttp.get(
            "/admin/schedule",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === STATUS.OK) {
            return new Response<ScheduleModel[]>({
                success: true,
                message: "Todos agendamentos registrados foram obtidos",
                data: response.data,
            });
        }

        throw new Error("Erro desconhecido ao obter os agendamentos registrados");
    } catch (error: unknown) {
        const message = "Não foi possível obter os agendamentos registrados";
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