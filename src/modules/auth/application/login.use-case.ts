import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../user/domain/ports/user.repository.port';
import { PasswordHashServicePort } from '../../user/domain/ports/password-hash.service.port';
import { LoginRequestDto } from '../presentation/dtos/login-request.dto';
import { AuthResponseDto } from '../presentation/dtos/auth-response.dto';
import {
  UserNotFoundException,
  InvalidPasswordException,
} from '../../../core/exceptions/domain.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHashService: PasswordHashServicePort,
  ) {}

  async execute(dto: LoginRequestDto): Promise<AuthResponseDto> {
    // Find user by email - tận dụng method từ UserRepository
    const user = await this.userRepository.findByEmail(dto.email);
    console.log('Found user:', user);
    if (!user) {
      throw new UserNotFoundException(dto.email);
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new UserNotFoundException(dto.email);
    }

    // Verify password - tận dụng compare method từ PasswordHashService
    const isPasswordValid = await this.passwordHashService.compare(
      dto.password,
      user.getPasswordHash(),
    );
    console.log('valid password', isPasswordValid);
    if (!isPasswordValid) {
      throw new InvalidPasswordException('Invalid email or password');
    }

    // Generate tokens (simplified - in production use JWT)
    const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString(
      'base64',
    );
    const refreshToken = Buffer.from(
      `${user.id}:${Date.now()}:refresh`,
    ).toString('base64');

    return {
      accessToken,
      refreshToken,
    };
  }
}
