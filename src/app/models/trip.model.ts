import { Car } from './car.model';
import { User } from './user.model';


export interface Trip {
  id?: string;
  carId: string;
  userId: string;
  seats: number;
  reservedSeats: number;
  fecha: string;
  car?: Car;
  user?: User;
}
  