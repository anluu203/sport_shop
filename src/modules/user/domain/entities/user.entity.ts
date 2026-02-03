import { BaseEntity } from '../../../../core/base/base.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export class User extends BaseEntity {
  private email: Email;
  private password: Password;
  private fullName: string;
  private phone?: string;
  private address?: string;
  private role: UserRole;
  private status: UserStatus;

  constructor(props: {
    id?: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    address?: string;
    role?: UserRole;
    status?: UserStatus;
    isHashed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id);
    this.email = new Email(props.email);
    this.password = new Password(props.password, props.isHashed || false);
    this.fullName = props.fullName;
    this.phone = props.phone;
    this.address = props.address;
    this.role = props.role || UserRole.CUSTOMER;
    this.status = props.status || UserStatus.ACTIVE;

    if (props.createdAt) this.createdAt = props.createdAt;
    if (props.updatedAt) this.updatedAt = props.updatedAt;
  }

  // Getters
  getEmail(): string {
    return this.email.getValue();
  }

  getPassword(): string {
    return this.password.getValue();
  }

  getFullName(): string {
    return this.fullName;
  }

  getPhone(): string | undefined {
    return this.phone;
  }

  getAddress(): string | undefined {
    return this.address;
  }

  getRole(): UserRole {
    return this.role;
  }

  getStatus(): UserStatus {
    return this.status;
  }

  // Business Logic Methods
  changePassword(newPassword: Password): void {
    this.password = newPassword;
    this.touch();
  }

  updateProfile(fullName: string, phone?: string, address?: string): void {
    this.fullName = fullName;
    this.phone = phone;
    this.address = address;
    this.touch();
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
    this.touch();
  }

  deactivate(): void {
    this.status = UserStatus.INACTIVE;
    this.touch();
  }

  ban(): void {
    this.status = UserStatus.BANNED;
    this.touch();
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
