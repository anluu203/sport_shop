import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PasswordHashServicePort } from '../../domain/ports/password-hash.service.port';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../../presentation/dtos/user-response.dto';
import { UserNotFoundException } from '../../../../core/exceptions/domain.exception';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashService: PasswordHashServicePort,
  ) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    // Update password if provided
    if (dto.password) {
      const hashedPassword = await this.passwordHashService.hash(dto.password);
      user.changePassword(hashedPassword);
    }

    // Save updated user
    const updatedUser = await this.userRepository.save(user);

    return this.toDto(updatedUser);
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
