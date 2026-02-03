import { UserRole, UserStatus } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
