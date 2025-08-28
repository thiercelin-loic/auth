import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './session.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column('simple-array')
  roles: string[];

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: false })
  mfa_enabled: boolean;

  @Column({ nullable: true })
  mfa_secret?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  last_login: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @Column({ nullable: true, type: 'text' })
  refresh_token: string | null;
}
