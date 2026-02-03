import { InvalidPasswordException } from '../../../../core/exceptions/domain.exception';

export class Password {
  private readonly value: string;

  constructor(password: string, isHashed: boolean = false) {
    if (!isHashed && !this.isValid(password)) {
      throw new InvalidPasswordException('Password must be at least 6 characters long');
    }
    this.value = password;
  }

  private isValid(password: string): boolean {
    return password && password.length >= 6;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.value;
  }
}
