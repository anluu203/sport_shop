**Command**
```
npm run start:dev
```

**1.Cấu trúc thư mục tổng quan**

Thay vì chia theo loại file (controllers, services, entities...), chúng ta sẽ chia theo Modules (Features), và trong mỗi Module sẽ có các tầng (Layers) rõ ràng.

```
src/
├── core/                       # Shared Kernel (Các thành phần dùng chung)
│   ├── base/                   # Base classes (BaseEntity, BaseUseCase)
│   ├── config/                 # Configurations
│   ├── exceptions/             # Custom Exceptions
│   └── types/                  # Common Types/Interfaces
│
├── modules/                    # Các tính năng chính (Feature Modules)
│   ├── user/
│   │   ├── domain/             # Layer 1: Enterprise Logic (Độc lập hoàn toàn)
│   │   │   ├── entities/       # User Entity (Pure TS Class)
│   │   │   ├── value-objects/  # Email, Password (Value Objects)
│   │   │   ├── ports/          # Interfaces (Repository Interface, Service Interface)
│   │   │   └── events/         # Domain Events
│   │   │
│   │   ├── application/        # Layer 2: Application Logic (Use Cases)
│   │   │   ├── use-cases/      # CreateUserUseCase, GetUserUseCase
│   │   │   └── dtos/           # Input/Output DTOs cho Use Case
│   │   │
│   │   ├── infrastructure/     # Layer 3: Frameworks & Drivers
│   │   │   ├── adapters/       # Repository Implementation (TypeORM, Prisma...)
│   │   │   ├── mappers/        # Chuyển đổi Data Model <-> Domain Entity
│   │   │   └── services/       # Implement các service ngoài (Bcrypt, Mailer)
│   │   │
│   │   ├── presentation/       # Layer 4: Interface Adapters
│   │   │   ├── controllers/    # HTTP Controllers
│   │   │   └── dtos/           # Request/Response DTOs (Validate bằng class-validator)
│   │   │
│   │   └── user.module.ts      # Đóng gói và Dependency Injection (DI)
│   │
│   └── order/                  # Module khác...
│
├── app.module.ts
└── main.ts
```

**2.Chi tiết từng Layer (Từ trong ra ngoài)**

***A. Domain Layer (Lõi trung tâm)***

Nhiệm vụ: Chứa các quy tắc nghiệp vụ cốt lõi (Business Rules) không thay đổi dù công nghệ thay đổi.

Đặc điểm: Không phụ thuộc vào NestJS, Database hay bất kỳ thư viện bên ngoài nào. Chỉ là thuần TypeScript.

Thành phần:

Entities: Class chứa logic nghiệp vụ (vd: User có phương thức changePassword).

Ports (Interfaces): Định nghĩa các "Cổng" giao tiếp. Ví dụ: IUserRepository chỉ định nghĩa hàm save(), findById(), nhưng không biết lưu vào SQL hay MongoDB.

```typescript
// src/modules/user/domain/ports/user.repository.port.ts
import { User } from '../entities/user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
```

***B. Application Layer (Use Cases)***

Nhiệm vụ: Điều phối luồng dữ liệu, thực hiện các kịch bản cụ thể của ứng dụng.

Đặc điểm: Import Domain Layer. Nó sẽ gọi đến Ports (Interfaces) chứ không gọi trực tiếp Database.

Thành phần: Use Cases (hoặc Services).

```typescript
// src/modules/user/application/use-cases/create-user.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';

@Injectable()
export class CreateUserUseCase {
  constructor(
    // Dependency Inversion: Inject Interface, không Inject Implementation
    private readonly userRepository: UserRepositoryPort, 
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = new User(dto);
    // Logic nghiệp vụ...
    return this.userRepository.save(user);
  }
}
```

***C. Infrastructure Layer***

Nhiệm vụ: Triển khai các chi tiết kỹ thuật (Database, External API).

Đặc điểm: Đây là nơi duy nhất biết bạn đang dùng TypeORM, Prisma, hay Mongoose. Nó implement các Ports được định nghĩa ở Domain.

Thành phần: Repository Implementation, Mappers.

```ts
// src/modules/user/infrastructure/adapters/typeorm-user.repository.ts
import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/typeorm-user.entity'; // DB Schema

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>
  ) {}

  async save(user: User): Promise<User> {
    const ormEntity = UserMapper.toPersistence(user); // Mapper Domain -> DB
    const saved = await this.repo.save(ormEntity);
    return UserMapper.toDomain(saved); // Mapper DB -> Domain
  }
  // ...
}
```

***D. Presentation Layer***

Nhiệm vụ: Giao tiếp với thế giới bên ngoài (Client). Nhận Request và trả về Response.

Đặc điểm: Chứa Controllers, Resolvers (GraphQL). Gọi đến Application Layer (Use Cases).

Thành phần: Controllers, Request DTOs.

```ts
// src/modules/user/presentation/controllers/user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserRequestDto) {
    return this.createUserUseCase.execute(body);
  }
}
```

**3. Cách kết nối các Layer (Dependency Injection)**

Đây là điểm quan trọng nhất trong NestJS để Clean Architecture hoạt động: Dependency Inversion.
Trong user.module.ts, bạn cần nói cho NestJS biết: "Khi ai đó cần UserRepositoryPort (Interface), hãy đưa cho họ TypeOrmUserRepository (Implementation)".

```ts
// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepositoryPort } from './domain/ports/user.repository.port';
import { TypeOrmUserRepository } from './infrastructure/adapters/typeorm-user.repository';
import { UserSchema } from './infrastructure/entities/typeorm-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    // MA THUẬT NẰM Ở ĐÂY:
    {
      provide: UserRepositoryPort,      // Token là Interface (Abstract Class)
      useClass: TypeOrmUserRepository,  // Class thực thi là Infrastructure
    },
  ],
})
export class UserModule {}
```

