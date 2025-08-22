import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
    verifyEmail(token: string) {
        throw new Error('Method not implemented.');
    }
    resetPassword(token: string, password: string) {
        throw new Error('Method not implemented.');
    }
    forgotPassword(email: string) {
        throw new Error('Method not implemented.');
    }
    refreshToken(refreshToken: any): { access_token: any; refresh_token: any; } | PromiseLike<{ access_token: any; refresh_token: any; }> {
        throw new Error('Method not implemented.');
    }
    logout(id: any, refresh_token: any) {
        throw new Error('Method not implemented.');
    }
    register(registerDto: RegisterDto) {
        throw new Error('Method not implemented.');
    }
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.usersService.findByUsername(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            result;
        }
        return null;
    }

    async login(user: User) {
        const payload = { username: user.first_name, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}