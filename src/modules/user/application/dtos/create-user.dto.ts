import { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}
