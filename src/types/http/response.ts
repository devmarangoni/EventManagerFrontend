interface ResponseTO<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export default class Response<T = unknown> {
    success: boolean;
    message: string;
    data: T;

    constructor({ success, message, data }: ResponseTO<T>) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}