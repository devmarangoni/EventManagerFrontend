import { UUID } from 'crypto';
import CustomerModel from '@/types/models/customerModel';
import ScheduleModel from '../models/scheduleModel';

export default interface EventRecordDto {
    eventId?: UUID;
    length: string;
    address: string;
    customer: CustomerModel;
    schedule?: ScheduleModel;
    theme?: string;
    description?: string;
    birthdayPerson?: string;
    value: number;
    isBudget: boolean;
    finished?: boolean
}