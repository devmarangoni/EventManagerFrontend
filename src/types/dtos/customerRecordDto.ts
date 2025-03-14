import { UUID } from "crypto";

export default interface CustomerRecordDto {
    customerId?: UUID;
    name: string;
    mobile: string;
    phone?: string;
    email: string;
}