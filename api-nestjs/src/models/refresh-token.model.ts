import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  is_revoked: boolean;

  @Column({ nullable: false })
  expires: Date;
}