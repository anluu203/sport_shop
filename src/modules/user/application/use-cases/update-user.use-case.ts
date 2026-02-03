import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';
import { UserNotFoundException } from '../../../../core/exceptions/domain.exception';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    // Update user profile
    user.updateProfile(
      dto.fullName ?? user.getFullName(),
      dto.phone ?? user.getPhone(),
      dto.address ?? user.getAddress(),
    );

    // Save updated user
    const updatedUser = await this.userRepository.save(user);

    return this.toDto(updatedUser);
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
