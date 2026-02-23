import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { LoginUseCase } from './application/login.use-case';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: Number(process.env.JWT_EXPIRATION) || 3600  },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
