import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserNotFoundException } from '../../../../core/exceptions/domain.exception';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    await this.userRepository.delete(userId);
  }
}
