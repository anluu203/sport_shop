import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { PasswordHashServicePort } from '../../domain/ports/password-hash.service.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { UserAlreadyExistsException } from '../../../../core/exceptions/domain.exception';
import { Password } from '../../domain/value-objects/password.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashService: PasswordHashServicePort,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(dto.email);
    }

    // Hash password
    const hashedPassword = await this.passwordHashService.hash(dto.password);

    // Create domain entity
    const user = new User({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      phone: dto.phone,
      address: dto.address,
      role: dto.role,
      isHashed: true,
    });

    // Save to repository
    const savedUser = await this.userRepository.save(user);

    // Return DTO
    return this.toDto(savedUser);
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
