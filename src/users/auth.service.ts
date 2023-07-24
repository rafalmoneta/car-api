import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

// Auth Service is relaying on UsersService
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email is already in use');
    }

    // Generating a 16 bytes long salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return this.usersService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
