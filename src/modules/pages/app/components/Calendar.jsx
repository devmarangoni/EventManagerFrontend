import { Flex, useDisclosure, useToast } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { ModalBudget } from "@pages/app/components/ModalBudget.jsx";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import getAllSchedulesController from "@controllers/schedule/getAllSchedulesController.js";
import { formatToDateTimeLocal } from "@pages/app/utils/dateUtils.js";
import getAllCustomersController from "@controllers/customer/getAllCustomersController.js";
import "./Calendar.css";

let startDate = null;

export const Calendar = () => {
  const { auth } = useAuth();
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const calendarRef = useRef(null);
  const toast = useToast();

  const {
    isOpen: isBudgetModalOpen,
    onOpen: onBudgetModalOpen,
    onClose: onBudgetModalClose
  } = useDisclosure();

  const handleCreateBudget = (selectedDate) => {
    const { start, startStr } = selectedDate;

    const ocuppedDay = events.some(event => formatToDateTimeLocal(event.start).includes(startStr));
    if(ocuppedDay){
      toast({
        status: "info",
        title: "Calendario",
        description: "Esse dia não está disponível",
        isClosable: true
      });
      return;
    }

    if(customers?.length > 0){
      startDate = start;
      onBudgetModalOpen();
      return;
    }
    
    toast({
      status: "info",
      title: "Evento",
      description: "Não foi possível obter os clientes",
      isClosable: true
    });
  }

  const handleEditEventSelectAndOpenModal = (event) => {
    if(auth?.user?.admin){
      console.log("Editar evento");
      console.log(JSON.stringify(event.event));
    }
  }

  const handleAddEvent = (budget, schedule, ocuppedDay) => {
    const { birthdayPerson, length } = budget;
    const classes = ["event-view"];
    const isAdmin = auth?.user?.admin;
    if(isAdmin) classes.push("admin-view-events");
    if(!isAdmin && ocuppedDay) classes.push("ocupped-day");

    const event = {
      id: birthdayPerson,
      content: budget || null,
      classNames: classes,
      title: `${birthdayPerson} - ${length}`,
      start: new Date(schedule)
    };

    setEvents((prevEvents) => [...prevEvents, event]);
  };

  useEffect(() => {
    const handleGetAllCustomers = async () => {
      try{
        const { success, data } = await getAllCustomersController(auth?.token);
        if(success){
          setCustomers(data);
          console.log(`customers :${JSON.stringify(customers)}`);
        }
      }catch(error){
        console.error("Erro ao buscar os clientes cadastrados");
        console.error(error?.message);
      }
    };

    handleGetAllCustomers();
  }, [auth.token, auth]);

  useEffect(() => {
    if(!auth?.user?.admin) return;

    const handleGetAllEvents = async () => {
      try{
        const { success, data } = await getAllSchedulesController(auth?.token);
        if(success){
          data.forEach(schedule => {
            const { events, eventDateTime } = schedule;
            events.forEach(event => {
              handleAddEvent(event, eventDateTime);
            });
          });
        }
      }catch(error){
        console.error("Erro ao obter os agendamentos cadastrados");
        console.error(error?.message);
      }
    }

    handleGetAllEvents();
  }, [auth.token, auth.user.admin]);

  return (
    <>
      <Flex flexDir="column" p="4">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "today next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale="pt-br"
          weekends={true}
          select={handleCreateBudget}
          eventClick={handleEditEventSelectAndOpenModal}
          events={events}
          longPressDelay={1000}
          eventLongPressDelay={1000}
          selectLongPressDelay={1000}
          selectable={true}
          dayMaxEvents={true}
          allDaySlot={false}
          editable={false}
          ref={calendarRef}
          eventBackgroundColor="#ee9f9f"
          height="700px"
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            list: "Lista",
          }}
        />
      </Flex>
      <ModalBudget
        addEvent={handleAddEvent}
        startDate={startDate}
        isOpen={isBudgetModalOpen}
        onClose={onBudgetModalClose}
        customers={customers}
      />
    </>
  );
};