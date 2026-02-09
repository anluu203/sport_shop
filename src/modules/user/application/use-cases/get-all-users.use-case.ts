import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../../presentation/dtos/user-response.dto';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toDto(user));
  }

  private toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.getUsername(),
      email: user.getEmail(),
      createdAt: user.createdAt,
      isDeleted: user.getIsDeleted(),
      deletedAt: user.getDeletedAt(),
    };
  }
}
