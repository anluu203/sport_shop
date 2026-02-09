import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PasswordHashServicePort } from '../../domain/ports/password-hash.service.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../../presentation/dtos/user-response.dto';
import { UserAlreadyExistsException } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashService: PasswordHashServicePort,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(dto.email);
    }

    // Hash password
    const hashedPassword = await this.passwordHashService.hash(dto.password);

    // Create domain entity with UUID
    const user = new User({
      id: uuidv4(),
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
    });

    // Save to repository
    const savedUser = await this.userRepository.save(user);

    // Return DTO
    return this.toDto(savedUser);
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
