import { UUID } from "crypto";
import EventModel from "./eventModel";

export default interface ScheduleModel {
    scheduleId: UUID;
    eventDateTime: Date;
    events: EventModel[];
}