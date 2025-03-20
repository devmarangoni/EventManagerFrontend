import axios from "axios"
import type ErrorResponseDto from "@/types/http/errorResponseDto"
import Response from "@/types/http/response"
import type ImageUploadResponseDto from "@/types/http/imageUploadResponseDto"

export async function uploadToCloudinary(
  imageData: string | File,
): Promise<Response<ImageUploadResponseDto | ErrorResponseDto>> {
  try {
    const formData = new FormData();
    formData.append("upload_preset", "MairaGasparini");

    if(typeof imageData === "string" && imageData.startsWith("data:")){
      formData.append("file", imageData);
    }else if(imageData instanceof File){
      formData.append("file", imageData);
    }else{
      throw new Error("Formato de imagem inválido");
    }

    const response = await axios.post(`https://api.cloudinary.com/v1_1/dhkqo27jd/image/upload`, formData);

    if(response.status === 200){
      return new Response<ImageUploadResponseDto>({
        success: true,
        message: "Imagem enviada com sucesso",
        data: {
          url: response.data.secure_url,
          success: true,
          message: "Upload realizado com sucesso",
        },
      });
    }

    throw new Error("Erro desconhecido ao enviar imagem");
  }catch(error: unknown){
    const message = "Erro ao fazer upload da imagem";
    const errorData: ErrorResponseDto = { message };

    if(axios.isAxiosError(error)){
      console.error("Erro Cloudinary:", error.response?.data);
      errorData.message = error.response?.data?.error?.message ?? message;
    }else if(error instanceof Error){
      errorData.message = error.message;
    }

    return new Response<ErrorResponseDto>({
      success: false,
      message: errorData.message,
      data: errorData,
    });
  }
}