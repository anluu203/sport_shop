import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn('uuid', { name: 'Id' })
  id: string;

  @Column({ unique: true })
  Username: string;

  @Column({ unique: true })
  Email: string;

  @Column()
  PasswordHash: string;

  @CreateDateColumn({ type: 'timestamp', name: 'CreatedAt' })
  CreatedAt: Date;

  @Column({ type: 'boolean', default: false })
  IsDeleted: boolean;

  @Column({ nullable: true })
  DeletedBy?: string;

  @Column({ nullable: true, type: 'timestamp' })
  DeletedAt?: Date;
}
