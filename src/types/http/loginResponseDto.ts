import UserModel from "../models/userModel";

export default interface LoginResponseDto {
    email: string;
    user: UserModel,
    token: string,
    message: string
}