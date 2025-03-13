import { UUID } from "crypto";

export default interface UserModel {
    userId: UUID;
    username: string;
    password: string;
    email: string;
    photo?: string;
    admin: boolean;
}