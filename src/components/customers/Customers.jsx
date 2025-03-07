import { Button, Flex, Heading, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import getAllCustomersController from "@controllers/customer/getAllCustomersController.js";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { CustomersTable } from "@components/customers/components/CustomersTable.jsx";
import { IoMdSearch, IoIosAdd } from "react-icons/io";
import { isBlank } from "@common/utils/isBlank.js";

let customers = [];

export const Customers = () => {
  const { auth } = useAuth();
  const searchInputRef = useRef(null);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleGetAllCustomers = async () => {
      try{
        const { success, data } = await getAllCustomersController(auth?.token);
        if (success){
          customers = data;
          console.log(JSON.stringify(customers));
          setFilteredCustomers(customers);
        }
      }catch(error){
        console.error("Erro ao buscar os clientes cadastrados");
        console.error(error?.message);
      }
    };

    handleGetAllCustomers();
  }, [auth.token, auth]);

  useEffect(() => {
    const handleFilterCustomerList = () => {
      if(isBlank(searchTerm)){
        setFilteredCustomers(customers);
        return;
      }

      setFilteredCustomers(
        customers.filter(customer => {
          return(
            customer?.name?.toLowerCase()?.includes(searchTerm) ||
            customer?.phone?.includes(searchTerm) ||
            customer?.mobile?.includes(searchTerm) ||
            customer?.user?.username?.toLowerCase()?.includes(searchTerm) ||
            customer?.user?.email?.toLowerCase()?.includes(searchTerm)
          );
        })
      );
    };

    const debounceTimeout = setTimeout(() => {
      handleFilterCustomerList();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleInputChange = () => {
    setSearchTerm(searchInputRef.current.value.toLowerCase());
  };

  return (
    <Flex flexDir="column" gap="1.5rem">
      <Flex
        w={{ base: "95vw", md: "80vw" }}
        flexDir="row"
        justify="space-between"
        align="center"
        position="fixed"
      >
        <Heading size="lg">Clientes</Heading>
        <InputGroup size="md" w="40%">
          <Input
            ref={searchInputRef}
            name="Search customer"
            onChange={handleInputChange}
            pr="4.5rem"
            type="text"
            placeholder="Buscar cliente"
            borderColor="gray.400"
          />
          <InputRightElement width="3rem">
            <Button
              h="1.75rem"
              size="sm"
              bg="transparent"
              onClick={handleInputChange}
            >
              <IoMdSearch fontSize="30px" />
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          h="100%"
          size="sm"
          bg="green.300"
          _hover={{
            bg: "green.400"
          }}
          onClick={handleInputChange}
        >
          <IoIosAdd fontSize="40px" />
        </Button>
      </Flex>

      <Flex w="100%" marginTop={{ base: "2em", md: "4em" }}>
        <CustomersTable
          customers={filteredCustomers}
        />
      </Flex>
    </Flex>
  );
};