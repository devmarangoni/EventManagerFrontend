import { Flex, useDisclosure, useToast } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";
import { ModalBudget } from "@pages/app/components/ModalBudget.jsx";
import getActiveEventScheduleByCustomerController from "@controllers/schedule/getActiveEventScheduleByCustomerController.js";
import { useAuth } from "@auth/hooks/AuthContext/UseAuth.jsx";
import getAllSchedulesController from "@controllers/schedule/getAllSchedulesController.js";
import { formatToDateTimeLocal } from "@pages/app/utils/dateUtils.js";
import getNextSchedulesController from "@controllers/schedule/getNextSchedulesController.js";
import "./Calendar.css";

let startDate = null;

export const Calendar = () => {
  const { auth } = useAuth();
  const { customer } = auth;
  const [events, setEvents] = useState([]);
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

    startDate = start;
    onBudgetModalOpen();
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

  /* CUSTOMER */
  useEffect(() => {
    if(auth?.user?.admin) return;

    const handleGetOcuppedDays = async () => {
      try{
        const { success, data } = await getNextSchedulesController(customer?.customerId);
        if(success){
          data.forEach((dayOcupped, index) => {
            const ocuppedEvent = {
              birthdayPerson: `Indisponível${index}`,
              length: ""
            };
            handleAddEvent(ocuppedEvent, dayOcupped, true);
          });
        }
      }catch(error){
        console.error("Erro ao obter os dias ocupados por agendamentos");
        console.error(error?.message);
      }
    }
    handleGetOcuppedDays();

    const handleGetCustomerActiveEvent = async () => {
      try{
        const { success, data } = await getActiveEventScheduleByCustomerController(customer?.customerId, auth?.token);
        if(success){
          const { events, eventDateTime } = data;
          events.forEach(event => {
            handleAddEvent(event, eventDateTime);
          });
        }
      }catch(error){
        console.error("Erro ao obter evento ativo do cliente");
        console.error(error?.message);
      }
    };
    handleGetCustomerActiveEvent();
  }, [customer, auth.token, auth.user.admin]);

  /* ADMIN */
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
      />
    </>
  );
};