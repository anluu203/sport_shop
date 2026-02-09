import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserNotFoundException } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string, deletedBy?: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    // Soft delete user
    user.delete(deletedBy || 'SYSTEM');
    await this.userRepository.save(user);
  }
}

