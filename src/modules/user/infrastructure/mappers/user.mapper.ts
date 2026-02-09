import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/typeorm-user.entity';

export class UserMapper {
  static toDomain(ormEntity: UserEntity): User {
    return new User({
      id: ormEntity.id,
      username: ormEntity.Username,
      email: ormEntity.Email,
      passwordHash: ormEntity.PasswordHash,
      isDeleted: ormEntity.IsDeleted,
      deletedBy: ormEntity.DeletedBy,
      deletedAt: ormEntity.DeletedAt,
      createdAt: ormEntity.CreatedAt,
    });
  }

  static toPersistence(domainEntity: User): UserEntity {
    const ormEntity = new UserEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.Username = domainEntity.getUsername();
    ormEntity.Email = domainEntity.getEmail();
    ormEntity.PasswordHash = domainEntity.getPasswordHash();
    ormEntity.IsDeleted = domainEntity.getIsDeleted();
    ormEntity.DeletedBy = domainEntity.getDeletedBy();
    ormEntity.DeletedAt = domainEntity.getDeletedAt();
    ormEntity.CreatedAt = domainEntity.createdAt;
    return ormEntity;
  }
}
