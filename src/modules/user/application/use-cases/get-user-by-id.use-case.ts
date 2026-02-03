import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserDto } from '../dtos/user.dto';
import { UserNotFoundException } from '../../../../core/exceptions/domain.exception';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return this.toDto(user);
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
