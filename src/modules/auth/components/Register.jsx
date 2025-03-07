import { Stack, Button, Heading, useToast, Flex } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DefaultLink } from "@common/components/DefaultLink.jsx";
import { FormField } from "@common/components/FormField.jsx";
import { useLoading } from "@common/hooks/Loading/useLoading.jsx";
import registerController from "@controllers/auth/registerController.js";

export function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const { showLoading, hideLoading } = useLoading();

  const formRef = useRef(null);
  const [checkInvalidInputs, setCheckInvalidInputs] = useState(false);
  const [userForm, setUserForm] = useState({
    email: null,
    password: null,
    username: null,
  });

  // const [customerForm, setCustomerForm] = useState({
  //   name: null,
  //   mobile: null,
  //   phone: null,
  //   email: null
  // });

  const handleUserInputChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  // const handleCustomerInputChange = (e) => {
  //   setCustomerForm({
  //     ...customerForm,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const register = async (e) => {
    try{
      e.preventDefault();
      setCheckInvalidInputs(false);

      showLoading();
      const { success, message } = await registerController(userForm);

      if(success){
        navigate("/login");
      }

      hideLoading();
      toast({
        status: success ? "success" : "error",
        title: "Cadastro",
        description: message,
        isClosable: true
      });
    } catch (error) {
      console.error("Erro ao cadastrar cliente");
      console.error(error?.message);
      toast({
        status: "error",
        title: "Cadastro",
        description: "Erro inesperado",
        isClosable: true
      });
    }
  };

  // const handleCreateCustomer = async (user) => {
  //   try{
  //     const { success } = await createCustomerController({
  //       ...customerForm
  //     });

  //     if(!success){
  //       throw new Error("Erro ao cadastrar cliente");
  //     }
  //   }catch(error){
  //     console.error("Erro ao cadastrar cliente");
  //     console.error(error?.message);
  //   }
  // }

  const handleFormValidation = () => {
    try {
      const form = formRef?.current;
      if (!form.checkValidity()) {
        setCheckInvalidInputs(true);
        throw new Error("Preencha todos os campos necessários.");
      }

      setCheckInvalidInputs(false);
    } catch (error) {
      toast({
        status: "error",
        title: "Cadastro",
        description: error?.message,
        isClosable: true
      });
    }
  };

  return (
    <Flex
      w="100%"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      gap={3}
    >
      <Heading>Cadastro</Heading>
      <form
        ref={formRef}
        onSubmit={register}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <Flex
          w="100%"
          justifyContent="center"
          alignItems="center"
          flexDir={{ base: "column", md: "row" }}
          gap={3}
        >
          <Stack spacing={3} width={{ base: "70%", md: "40%", lg: "40%", xl: "25%" }}>
            <FormField
              onChange={handleUserInputChange}
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
              onChange={handleUserInputChange}
              label="Senha"
              placeholder="Informe sua senha"
              name="password"
              size="md"
              type="password"
              isRequired={true}
              checkIfIsInvalid={checkInvalidInputs}
              errorMessage="Por favor, informe uma senha."
            />
            <FormField
              onChange={handleUserInputChange}
              label="Nome de usuário"
              name="username"
              placeholder="Informe seu nome de usuário"
              size="md"
            />
          </Stack>
          {/* CUSTOMER OLD DATA (USE TO CREATE NEW CUSTOMER ON CUSTOMER SCREENS) {isCustomer ? (
            <Stack spacing={3} width={{ base: "70%", md: "40%", lg: "40%", xl: "25%" }}>
              <FormField
                onChange={handleCustomerInputChange}
                label="Nome completo"
                placeholder="Informe seu nome completo"
                name="name"
                size="md"
                isRequired={true}
                checkIfIsInvalid={checkInvalidInputs}
                errorMessage="Por favor, informe seu nome."
              />
              <FormField
                onChange={handleCustomerInputChange}
                label="Celular (apenas números)"
                placeholder="Informe seu número de celular"
                name="mobile"
                size="md"
                type="tel"
                isRequired={true}
                checkIfIsInvalid={checkInvalidInputs}
                errorMessage="Por favor, informe um celular válido."
              />
              <FormField
                onChange={handleCustomerInputChange}
                label="Telefone (apenas números)"
                placeholder="Informe seu número de telefone"
                name="phone"
                size="md"
                type="tel"
              />
            </Stack>
          ) : null} */}
        </Flex>

        <Button type="submit" onClick={handleFormValidation}>
          Criar conta
        </Button>
      </form>
      <DefaultLink
        direction={"/login"}
        content="Já possuo uma conta"
      />
    </Flex>
  );
}