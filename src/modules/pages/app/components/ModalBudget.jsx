import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    VStack,
    FormLabel,
    FormControl,
} from "@chakra-ui/react";
import { FormField } from "@common/components/FormField.jsx";
import PropTypes from "prop-types";
import { useState } from "react";
import { formatToDateTimeLocal, formatToScheduleObjTime } from "@pages/app/utils/dateUtils.js";
import { useToast } from "@chakra-ui/react";
import { useLoading } from "@common/hooks/Loading/useLoading";
import createEventController from "@controllers/partyEvent/createEventController.js";
import createScheduleController from "@controllers/schedule/createScheduleController";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import { isBlank } from "@common/utils/isBlank.js";

const requiredFields = ["length", "address", "theme", "birthdayPerson"];
const INITIAL_BUDGET = {
    customer: "",
    length: "M",
    address: null,
    theme: null,
    description: null,
    birthdayPerson: null,
    value: 0.0,
    isBudget: true,
    finished: false
};

export const ModalBudget = ({ startDate, addEvent, isOpen, onClose, customers }) => {
    const toast = useToast();
    const { showLoading, hideLoading } = useLoading();
    const [checkInvalidInputs, setCheckInvalidInputs] = useState(false);
    const { auth } = useAuth();

    const [budget, setBudget] = useState(INITIAL_BUDGET);

    const handleBudgetInputChange = (e) => {
        setBudget({
            ...budget,
            [e.target.name]: e.target.value
        });

        console.log(budget);
    }

    const [schedule, setSchedule] = useState({
        eventDateTime: null,
        events: []
    });

    const handleScheduleInputChange = (e) => {
        setSchedule({
            ...schedule,
            [e.target.name]: e.target.value
        });
    }
    
    const handleBudgetValidation = () => {
        try{
            const missingFields = requiredFields.filter(field => !budget[field]);
            console.log(missingFields);
            const missingSchedule = !schedule.eventDateTime;
            const missingCustomer = isBlank(budget.customer);
            if(missingFields.length > 0 || missingSchedule || missingCustomer){
                setCheckInvalidInputs(true);

                if(missingCustomer){
                    throw new Error("Escolha um cliente");
                }

                if(missingSchedule){
                    throw new Error("Preencha a hora do evento");
                }
     
                throw new Error("Preencha todos os campos necessários");
            }

            handleCreateEvent();
        }catch(error){
            toast({
                status: "error",
                title: "Campos obrigatórios",
                description: error?.message,
                isClosable: true
            });
        }
    };

    const handleCreateEvent = async () => {
        try{
            showLoading();
            const customerId = budget.customer;
            const budgetWithCustomer = {
                ...budget,
                customer: customers.find(customer => customerId === customer.customerId)
            }

            const { success, message, data } = await createEventController(budgetWithCustomer, auth.token);
            if(success){
                await handleScheduleEvent(data.eventId);     
            }

            toast({
                status: success ? "success" : "error",
                title: "Evento",
                description: message,
                isClosable: true
            });
            hideLoading();
        }catch(error){
            console.error(error?.message);
            toast({
                status: "error",
                title: "Evento",
                description: "Erro ao cadastrar evento",
                isClosable: true
            });
        }finally{
            setBudget(INITIAL_BUDGET);
            handleOnCloseModal();
        }
    }

    const handleScheduleEvent = async (eventId) => {
        try{
            showLoading();
            const { success, message, data } = await createScheduleController({
                events: [eventId],
                eventDateTime: formatToScheduleObjTime(new Date(schedule.eventDateTime))
            }, auth.token);

            if(success){
                console.log(JSON.stringify(data));
                addEvent(budget, schedule.eventDateTime, false);
            }

            toast({
                status: success ? "success" : "error",
                title: "Agendamento",
                description: message,
                isClosable: true
            });
            hideLoading();
        }catch(error){
            console.error("Erro ao cadastrar cliente");
            console.error(error?.message);
            toast({
                status: "error",
                title: "Agendamento",
                description: "Erro ao cadastrar agendamento para o evento",
                isClosable: true
            });
        }
    }

    const handleOnCloseModal = () => {
        setCheckInvalidInputs(false);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Criar evento</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={2}>
                        <FormControl 
                            isRequired={true}
                            w="100%"
                        >
                            <FormLabel>Cliente</FormLabel>
                            <Select 
                                placeholder="Escolha o cliente"
                                name="customer"
                                onChange={handleBudgetInputChange}
                                value={budget.customer}
                            >
                                {
                                    customers?.map(customer => (
                                        <option 
                                            key={customer.customerId} 
                                            value={customer.customerId}
                                        >{ customer.name }</option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormField
                            onChange={handleBudgetInputChange}
                            label="Tema"
                            placeholder="Informe o tema"
                            name="theme"
                            size="md"
                            isRequired={true}
                            checkIfIsInvalid={checkInvalidInputs}
                            errorMessage="Por favor, informe o tema."
                        />
                        <FormControl 
                            isRequired={true}
                            w="100%"
                        >
                            <FormLabel>Tamanho</FormLabel>
                            <Select 
                                placeholder="Escolha o tamanho do evento"
                                name="length"
                                onChange={handleBudgetInputChange}
                                value={budget.length}
                            >
                                <option value="P">Pequeno</option>
                                <option value="M">Médio</option>
                                <option value="G">Grande</option>
                            </Select>
                        </FormControl>
                        <FormField
                            onChange={handleBudgetInputChange}
                            label="Nome do aniversariante"
                            placeholder="Informe o aniversariante"
                            name="birthdayPerson"
                            size="md"
                            isRequired={true}
                            checkIfIsInvalid={checkInvalidInputs}
                            errorMessage="Por favor, informe o nome do aniversariante."
                        />
                        <FormField
                            onChange={handleScheduleInputChange}
                            label="Horário"
                            placeholder="Informe o horário do evento"
                            name="eventDateTime"
                            type="datetime-local"
                            size="md"
                            value={formatToDateTimeLocal(new Date(startDate))}
                            isRequired={true}
                            checkIfIsInvalid={checkInvalidInputs}
                            errorMessage="Por favor, informe o horário."
                        />
                        <FormField
                            onChange={handleBudgetInputChange}
                            label="Endereço"
                            placeholder="12345-678: bairro, rua, 777"
                            name="address"
                            size="md"
                            isRequired={true}
                            checkIfIsInvalid={checkInvalidInputs}
                            errorMessage="Por favor, informe o endereço."
                        />
                        <FormField
                            onChange={handleBudgetInputChange}
                            label="Descrição"
                            placeholder="Informe a descrição"
                            name="description"
                            size="md"
                        />
                    </VStack>

                </ModalBody>
                <ModalFooter display="flex" gap="4">
                    <Button onClick={handleOnCloseModal}>Voltar</Button>
                    <Button colorScheme="purple" onClick={handleBudgetValidation}>Realizar orçamento</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

ModalBudget.propTypes = {
    startDate: PropTypes.any,
    addEvent: PropTypes.func,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    customers: PropTypes.array
}