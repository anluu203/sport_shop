export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}
