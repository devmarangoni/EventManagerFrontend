import { UUID } from 'crypto';

export default interface ScheduleRecordDto {
    eventDateTime: Date;
    events: UUID[]
}