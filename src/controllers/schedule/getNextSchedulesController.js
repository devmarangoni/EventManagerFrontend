import getNextSchedules from "@services/schedule/getNextSchedules.js";
import StandardResponse from "@common/http/standardResponse.js";

export default async function getNextSchedulesController(customerId){
    try{
        const { success, message, data } = await getNextSchedules(customerId);
        return new StandardResponse(success, message, data);
    }catch(error){
        console.error("Erro ao obter evento do cliente");
        console.error(error?.message);
        return new StandardResponse(false, "Erro inesperado ao obter evento ativo do cliente!", null);
    }
}