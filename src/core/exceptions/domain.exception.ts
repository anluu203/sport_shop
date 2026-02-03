export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email: ${email}`);
    this.name = 'InvalidEmailException';
  }
}

export class InvalidPasswordException extends DomainException {
  constructor(reason: string) {
    super(`Invalid password: ${reason}`);
    this.name = 'InvalidPasswordException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}
