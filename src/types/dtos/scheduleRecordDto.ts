import { UUID } from 'crypto';

export default interface ScheduleRecordDto {
    eventDateTime: Date | string;
    events: UUID[]
}