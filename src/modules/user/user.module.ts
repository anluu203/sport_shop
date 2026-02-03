import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation Layer
import { UserController } from './presentation/controllers/user.controller';

// Application Layer
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

// Domain Layer
import { UserRepositoryPort } from './domain/ports/user.repository.port';
import { PasswordHashServicePort } from './domain/ports/password-hash.service.port';

// Infrastructure Layer
import { UserEntity } from './infrastructure/entities/typeorm-user.entity';
import { TypeOrmUserRepository } from './infrastructure/adapters/typeorm-user.repository';
import { BcryptPasswordHashService } from './infrastructure/services/bcrypt-password-hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    // Repository - Dependency Inversion
    {
      provide: UserRepositoryPort,
      useClass: TypeOrmUserRepository,
    },

    // Services - Dependency Inversion
    {
      provide: PasswordHashServicePort,
      useClass: BcryptPasswordHashService,
    },
  ],
  exports: [
    UserRepositoryPort,
    PasswordHashServicePort,
  ],
})
export class UserModule {}
