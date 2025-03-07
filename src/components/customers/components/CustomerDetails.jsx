import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { CustomerCard } from '@components/customers/components/CustomerCard.jsx';

export const CustomerDetails = ({ isOpen, onClose, customer }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered
    >
        <ModalOverlay />
        <ModalContent m={{ base: "0 16px", md: "0" }} bg="pink.300">
        <ModalHeader>Detalhes do Cliente</ModalHeader>
        <ModalCloseButton />
        <ModalBody p="0px 16px 16px">
            <CustomerCard customer={customer}/>
        </ModalBody>
        </ModalContent>
    </Modal>
  );
}

CustomerDetails.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    customer: PropTypes.object
};