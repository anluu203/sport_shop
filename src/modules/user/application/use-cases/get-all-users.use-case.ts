import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserDto } from '../dtos/user.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toDto(user));
  }

  private toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.getEmail(),
      fullName: user.getFullName(),
      phone: user.getPhone(),
      address: user.getAddress(),
      role: user.getRole(),
      status: user.getStatus(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
