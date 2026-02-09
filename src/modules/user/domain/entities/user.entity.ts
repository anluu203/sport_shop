import { BaseEntity } from '../../../../core/base/base.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class User extends BaseEntity {
  private username: string;
  private email: Email;
  private passwordHash: Password;
  private isDeleted: boolean;
  private deletedBy?: string;
  private deletedAt?: Date;

  constructor(props: {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    isDeleted?: boolean;
    deletedBy?: string;
    deletedAt?: Date;
    createdAt?: Date;
  }) {
    super(props.id);
    this.username = props.username;
    this.email = new Email(props.email);
    this.passwordHash = new Password(props.passwordHash, true);
    this.isDeleted = props.isDeleted || false;
    this.deletedBy = props.deletedBy;
    this.deletedAt = props.deletedAt;

    if (props.createdAt) this.createdAt = props.createdAt;
  }

  // Getters
  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getPasswordHash(): string {
    return this.passwordHash.getValue();
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }

  getDeletedBy(): string | undefined {
    return this.deletedBy;
  }

  getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }

  // Business Logic Methods
  changePassword(newPasswordHash: string): void {
    this.passwordHash = new Password(newPasswordHash, true);
    this.touch();
  }

  delete(deletedBy: string): void {
    this.isDeleted = true;
    this.deletedBy = deletedBy;
    this.deletedAt = new Date();
    this.touch();
  }

  restore(): void {
    this.isDeleted = false;
    this.deletedBy = undefined;
    this.deletedAt = undefined;
    this.touch();
  }

  isActive(): boolean {
    return !this.isDeleted;
  }
}
