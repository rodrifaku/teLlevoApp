import { Trip } from './trip.model';
import { User } from './user.model';

export interface Reservation {
    id?: string;
    userId: string;
    tripId: string;
    seats: number;
    reservationDate: Date;
    trip?: Trip;
    user?: User;
}
