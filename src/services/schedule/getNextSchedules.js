import axios from "@common/http/axios.js";
import HTTP_RESPONSE_STATUS from "@common/http/httpResponseStatus.js";
import StandardResponse from "@common/http/standardResponse.js";

export default async (customerId) => {
    try{
        const response = await axios.get(`/schedule/events/next?customer=${customerId}`);

        const { status, data } = response;
        if(status === HTTP_RESPONSE_STATUS.OK){
            return new StandardResponse(true, "Datas dos dias ocupados foram obtidas", data);
        }

        const { message } = data;
        throw new Error(message);
    }catch(error){
        const message = error?.response?.data?.message || error?.message || "Não foi possível obter os dias ocupados com agendamento";
        return new StandardResponse(false, message, null);
    }
}