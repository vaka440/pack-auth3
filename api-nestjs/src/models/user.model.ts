import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  hashedPassword: string;

  @Column({ enum: ['admin', 'user'], default: 'user' })
  role: Role;
}
