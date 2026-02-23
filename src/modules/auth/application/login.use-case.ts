import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginRequestDto): Promise<AuthResponseDto> {
    // Find user by email - tận dụng method từ UserRepository
    const user = await this.userRepository.findByEmail(dto.email);
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
    if (!isPasswordValid) {
      throw new InvalidPasswordException('Invalid email or password');
    }

    // Generate tokens using JWT
    const payload = {  email: user.getEmail(), userName: user.getUsername() };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
