export abstract class PasswordHashServicePort {
  abstract hash(password: string): Promise<string>;
  abstract compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
