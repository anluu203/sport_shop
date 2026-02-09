export class UserDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}
