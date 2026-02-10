import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../../application/login.use-case';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }
}
