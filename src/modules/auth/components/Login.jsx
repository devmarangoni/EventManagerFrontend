import {
   Box,
   Heading,
   Stack,
   Button
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { FormField } from "@common/components/FormField";
//import { DefaultLink } from "@common/components/DefaultLink.jsx";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { useLoading } from "@common/hooks/Loading/useLoading";
import loginController from "@controllers/auth/loginController.js";
import { isBlank } from "@common/utils/isBlank.js";

export function Login(){
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();
    const { showLoading, hideLoading } = useLoading();

    const formRef = useRef(null);
    const [checkInvalidInputs, setCheckInvalidInputs] = useState(false);
    const [useForm, setUseForm] = useState({
        email: null,
        password: null
    });

    const handleLoginInputChange = (e) => {
        setUseForm({
            ...useForm,
            [e.target.name]: e.target.value
        })
    }

    const handleLogin = async (e) => {
        try{
            e.preventDefault();
            setCheckInvalidInputs(false);

            const { email, password } = useForm;
            const isNotValidForm = isBlank(email) || isBlank(password);
            if(isNotValidForm) return;

            showLoading();
            const { success, message, data } = await loginController(email, password);
            if(success){
                const { token, user } = data;
                login(token, user);
                navigate("/");
            }

            toast({
                status: success ? "success" : "error",
                title: "Login",
                description: message,
                isClosable: true
            });
        }catch(error){
            console.error("Erro ao realizar login");
            console.error(error?.message);
            toast({
                status: "error",
                title: "Login",
                description: error?.message || "Erro ao realizar login",
                isClosable: true
            });
        }finally{
            hideLoading();
        }
    }

    const handleFormValidation = () => {
        try{
          const form = formRef?.current;
          if(!form.checkValidity()){
            setCheckInvalidInputs(true);
            throw new Error("Preencha todos os campos necessários.");
          }
          
          setCheckInvalidInputs(false);
        }catch(error){
          toast({
            status: "error",
            title: "Login",
            description: error?.message,
            isClosable: true
          });
        }
    };

    return(
        <Box
            w="100%"
            h="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
            gap={3}
        >
            <Heading>Login</Heading>
            <form 
                ref={formRef}
                onSubmit={handleLogin}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem"
                }}
            >
                <Stack spacing={3} width={{ base: "70%", md: "50%", lg: "40%", xl: "25%" }}>
                    <FormField
                        onChange={handleLoginInputChange}
                        label="Email"
                        placeholder="Informe seu email"
                        name="email"
                        size="md"
                        type="email"
                        isRequired={true}
                        checkIfIsInvalid={checkInvalidInputs}
                        errorMessage="Por favor, informe um email válido."
                    />
                    <FormField
                        onChange={handleLoginInputChange}
                        label="Senha"
                        placeholder="Informe sua senha"
                        name="password"
                        size="md"
                        type="password"
                        isRequired={true}
                        checkIfIsInvalid={checkInvalidInputs}
                        errorMessage="Por favor, informe uma senha."
                    />
                </Stack>
                <Button type="submit" onClick={handleFormValidation}>Entrar</Button>
            </form>
            {/* <DefaultLink
                direction={"/cadastro"}
                content="Não possui uma conta? Contate um administrador!"
            /> */}
        </Box>
    )
}