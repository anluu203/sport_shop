import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserResponseDto } from '../../presentation/dtos/user-response.dto';
import { UserNotFoundException } from '../../../../core/exceptions/domain.exception';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return this.toDto(user);
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
