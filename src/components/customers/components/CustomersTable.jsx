import { useState } from "react";
import { 
  Stack, Table, Thead, Tbody, Tr, Th, Td, Button, Modal, 
  ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton 
} from "@chakra-ui/react";
import PropTypes from "prop-types";

export const CustomersTable = ({ customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <Stack w="100%" gap="10">
      <div style={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}>
        <Table w="full" variant="striped" tableLayout="fixed" display={{ base: "none", md: "table" }}>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Celular</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.length > 0 && customers.map((customer) => (
              <Tr key={customer?.customerId}>
                <Td>{customer?.name}</Td>
                <Td>{customer?.user?.email}</Td>
                <Td>{customer?.mobile}</Td>
                <Td>
                  <Button size="sm" onClick={() => setSelectedCustomer(customer)}>Ver</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div style={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}>
        <Table w="full" variant="striped" tableLayout="fixed" display={{ base: "table", md: "none" }}>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers?.length > 0 && customers.map((customer) => (
              <Tr key={customer?.customerId}>
                <Td>{customer?.name}</Td>
                <Td>
                  <Button size="sm" onClick={() => setSelectedCustomer(customer)}>Ver</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {selectedCustomer && (
        <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalhes do Cliente</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p><strong>Nome:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.user?.email}</p>
              <p><strong>Celular:</strong> {selectedCustomer.mobile}</p>
              <p><strong>Telefone:</strong> {selectedCustomer.phone}</p>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      
    </Stack>
  );
}

CustomersTable.propTypes = {
  customers: PropTypes.array
};