import { UUID } from "crypto";

export default interface CustomerModel {
    customerId: UUID;
    name: string;
    phone?: string;
    mobile: string;
    email: string;
}