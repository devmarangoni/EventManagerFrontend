"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/context/auth/UseAuth"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/theme/ThemeContext"
import { Camera, Check, Eye, EyeOff, Loader2, User, X } from "lucide-react"
import type UserRecordDto from "@/types/dtos/userRecordDto"
import updateUserService from "@/services/user/updateUserService"
// Importar o serviço do Cloudinary
import { uploadToCloudinary } from "@/services/storage/cloudinaryService"

export default function ProfilePage() {
  const { auth, login } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<UserRecordDto>({
    userId: auth.user?.userId,
    username: auth.user?.username || "",
    email: auth.user?.email || "",
    password: "",
    photo: auth.user?.photo || "",
  })

  const [confirmPassword, setConfirmPassword] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    if (auth.user) {
      setFormData({
        userId: auth.user.userId,
        username: auth.user.username,
        email: auth.user.email,
        password: "",
        photo: auth.user.photo || "",
      })
      setPreviewImage(auth.user.photo || null)
      setPhotoFile(null)
    }
  }, [auth.user, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar o tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "O tamanho máximo permitido é 5MB",
        })
        return
      }

      // Apenas para preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreviewImage(base64String)
      }
      reader.readAsDataURL(file)

      // Armazenar o arquivo para upload posterior
      setPhotoFile(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.username.trim()) {
      toast.error("Nome de usuário é obrigatório")
      return
    }

    if (!formData.email.trim()) {
      toast.error("Email é obrigatório")
      return
    }

    if (formData.password && formData.password !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }

    setIsLoading(true)

    try {
      let photoUrl = formData.photo

      // Se tiver um arquivo de foto para upload
      if (photoFile) {
        setIsUploading(true)
        toast.info("Enviando imagem...")

        const uploadResponse = await uploadToCloudinary(photoFile)

        if (uploadResponse.success && uploadResponse.data && "url" in uploadResponse.data) {
          // Usar a URL retornada pelo Cloudinary
          photoUrl = uploadResponse.data.url
          toast.success("Imagem enviada com sucesso!")
        } else {
          toast.error("Falha ao enviar imagem", {
            description: uploadResponse.message,
          })
          // Continuar mesmo com falha no upload da imagem
        }

        setIsUploading(false)
      }

      // Preparar dados para envio
      const dataToSubmit: UserRecordDto = {
        ...formData,
        password: formData.password || auth.user?.password || "",
        photo: photoUrl, // Usar a URL da imagem do Cloudinary
      }

      const response = await updateUserService(dataToSubmit, auth.token || "")

      if (response.success && response.data) {
        // Update the user in auth context
        if (auth.user) {
          const updatedUser = {
            ...auth.user,
            username: formData.username,
            email: formData.email,
            photo: photoUrl,
          }

          // Re-login to update the auth context
          login(auth.token || "", updatedUser)

          toast.success("Perfil atualizado com sucesso!")
          setIsEditing(false)
          setPhotoFile(null)
        }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error("Erro ao atualizar perfil", {
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    // Reset form data
    if (auth.user) {
      setFormData({
        userId: auth.user.userId,
        username: auth.user.username,
        email: auth.user.email,
        password: "",
        photo: auth.user.photo || "",
      })
      setPreviewImage(auth.user.photo || null)
      setPhotoFile(null)
    }
    setConfirmPassword("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">Visualize e edite suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Photo Card */}
          <Card className={cn("col-span-1 border", isDark ? "bg-gray-900/50" : "bg-white/50")}>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>Sua foto será exibida em seu perfil e em comentários</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative mb-6">
                <div
                  className={cn(
                    "w-32 h-32 rounded-full overflow-hidden border-4",
                    isDark ? "border-gray-700" : "border-gray-200",
                    "bg-gradient-to-br from-purple-600/10 to-pink-500/10",
                  )}
                >
                  {previewImage ? (
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt={formData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={cn(
                      "absolute bottom-0 right-0 p-2 rounded-full",
                      isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100",
                      "border shadow-md",
                    )}
                    disabled={isUploading}
                  >
                    <Camera className="w-5 h-5 text-purple-500" />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={!isEditing || isUploading}
                />
              </div>

              {isEditing && (
                <div className="text-center text-sm text-muted-foreground">
                  {photoFile ? (
                    <span className="text-green-500">Nova foto selecionada</span>
                  ) : (
                    "Clique na câmera para alterar sua foto"
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Info Card */}
          <Card className={cn("col-span-1 md:col-span-2 border", isDark ? "bg-gray-900/50" : "bg-white/50")}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Gerencie suas informações de conta</CardDescription>
                </div>

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full sm:w-auto"
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={cn(!isEditing && "bg-muted", isDark && !isEditing && "bg-gray-800")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing || isLoading}
                      className={cn(!isEditing && "bg-muted", isDark && !isEditing && "bg-gray-800")}
                    />
                  </div>
                </div>

                {isEditing && (
                  <>
                    <Separator />

                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-sm flex items-center gap-1">
                        Nova Senha
                        <span className="text-xs text-muted-foreground">(deixe em branco para manter a atual)</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          placeholder="••••••••"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>

              {isEditing && (
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={isLoading || isUploading}
                    className="w-full sm:w-auto"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}