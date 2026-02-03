import { User, UserRole, UserStatus } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/typeorm-user.entity';

export class UserMapper {
  static toDomain(ormEntity: UserEntity): User {
    return new User({
      id: ormEntity.id,
      email: ormEntity.email,
      password: ormEntity.password,
      fullName: ormEntity.fullName,
      phone: ormEntity.phone,
      address: ormEntity.address,
      role: ormEntity.role as UserRole,
      status: ormEntity.status as UserStatus,
      isPasswordHashed: true,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  static toPersistence(domainEntity: User): UserEntity {
    const ormEntity = new UserEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.email = domainEntity.getEmail();
    ormEntity.password = domainEntity.getPassword();
    ormEntity.fullName = domainEntity.getFullName();
    ormEntity.phone = domainEntity.getPhone();
    ormEntity.address = domainEntity.getAddress();
    ormEntity.role = domainEntity.getRole();
    ormEntity.status = domainEntity.getStatus();
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}
