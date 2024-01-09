import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
@Unique(['nickname'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname?: string | null;

  @Column({ nullable: true })
  intro?: string | null;

  @Column({ nullable: true })
  avatar?: string | null;

  @Column({ default: 1 })
  type?: number;

  @Column({ nullable: true })
  refreshToken?: string | null;

  @CreateDateColumn()
  createdAt?: Date;
}
