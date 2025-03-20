import { UUID } from "crypto";

export default interface UserRecordDto {
    userId?: UUID
    username: string;
    password: string;
    email: string;
    photo?: string;
}