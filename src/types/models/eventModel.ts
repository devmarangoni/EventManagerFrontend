import { UUID } from "crypto";
import CustomerModel from "./customerModel";
import ScheduleModel from "./scheduleModel";

export default interface EventModel {
    eventId: UUID;
    length: string;
    address: string;
    theme: string;
    birthdayPerson?: string;
    description?: string;
    finished?: boolean;
    isBudget: boolean;
    value: number
    customer: CustomerModel
    schedule?: ScheduleModel
}