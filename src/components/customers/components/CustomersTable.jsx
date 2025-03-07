import { useState } from "react";
import { Stack, Table, Thead, Tbody, Tr, Th, Td, Button, useDisclosure } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { CustomerDetails } from '@components/customers/components/CustomerDetails.jsx';
import { IoIosCreate } from "react-icons/io";

export const CustomersTable = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    isOpen: isCustomerDetailsModalOpen,
    onOpen: onCustomerDetailsModalOpen,
    onClose: onCustomerDetailsModalClose
  } = useDisclosure();

  const handleOpenCustomerDetails = (targetCustomer) => {
    setSelectedCustomer(targetCustomer);
    onCustomerDetailsModalOpen();
  }

  return (
    <Stack w="100%" gap="10">
      <div style={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}>
        <Table w="full" variant="striped" display={{ base: "none", md: "table" }}>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Celular</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.length > 0 && customers.map((customer) => (
              <Tr key={customer?.customerId}>
                <Td>{customer?.name}</Td>
                <Td>{customer?.email}</Td>
                <Td>{customer?.mobile}</Td>
                <Td>
                  <Button
                    p="4px"
                    color="pink.200"
                    bg="gray.600"
                    _hover={{
                      bg:"gray.900"
                    }}
                    onClick={() => handleOpenCustomerDetails(customer)}
                  >
                    <IoIosCreate fontSize="25px" />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div style={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}>
        <Table w="full" variant="striped" display={{ base: "table", md: "none" }}>
          <Thead>
            <Tr>
              <Th>Nome</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.length > 0 && customers.map((customer) => (
              <Tr key={customer?.customerId}>
                <Td>{customer?.name}</Td>
                <Td>
                  <Button
                    p="4px"
                    color="pink.200"
                    bg="gray.600"
                    _hover={{
                      bg:"gray.900"
                    }}
                    onClick={() => handleOpenCustomerDetails(customer)}
                  >
                    <IoIosCreate fontSize="25px" />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      
      <CustomerDetails
        isOpen={isCustomerDetailsModalOpen}
        onClose={onCustomerDetailsModalClose}
        customer={selectedCustomer}
      />
    </Stack>
  );
}

CustomersTable.propTypes = {
  customers: PropTypes.array
};