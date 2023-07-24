import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @Column({ default: false })
  approved: boolean;

  // @Column()
  // createdAt: string;

  // @Column()
  // updatedAt: string;

  // @Column()
  // userId: number;

  // @Column()
  // color: string;

  // @Column()
  // fuelType: string;

  // @Column()
  // bodyType: string;

  // @Column()
  // condition: string;
}
