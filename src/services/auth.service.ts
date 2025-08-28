import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../services/users.service';
import { User } from '../validators/user.entity';
import { RegisterDto } from 'src/validators/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async verifyEmail(token: string) {
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
            throw new Error('Email verification failed: Invalid or missing token');
        }
        try {
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            await this.usersService.update(userId, { email_verified: true });
            return { success: true };
        } catch (error) {
            throw new Error('Email verification failed: ' + error.message);
        }
    }

    async resetPassword(token: string, password: string) {
        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
            throw new Error('Password reset failed: Invalid or missing token');
        }
        try {
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.usersService.update(userId, { password_hash: hashedPassword });
            return { success: true };
        } catch (error) {
            throw new Error('Password reset failed: ' + error.message);
        }
    }

    async forgotPassword(email: string) {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }

            const payload = { email: user.email, sub: user.id };
            const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });
            return { success: true, resetToken };
        } catch (error) {
            throw new Error('Password reset request failed: ' + error.message);
        }
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const userId = payload.sub;

            const user = await this.usersService.findById(userId);
            if (!user || user.refresh_token !== refreshToken) {
                throw new Error('Invalid refresh token');
            }

            const newPayload = { email: user.email, sub: user.id };
            const access_token = this.jwtService.sign(newPayload);
            const refresh_token = this.jwtService.sign(newPayload, { expiresIn: '7d' });

            await this.usersService.update(user.id, { refresh_token });
            return { access_token, refresh_token };
        } catch (error) {
            throw new Error('Token refresh failed: ' + error.message);
        }
    }

    async logout(id: any, refresh_token: any) {
        try {
            this.usersService.update(id, { refresh_token });
            return { success: true };
        } catch (error) {
            throw new Error('Logout failed: ' + error.message);
        }
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = await this.usersService.create({
            ...registerDto,
            password_hash: hashedPassword,
            roles: ['user'],
        });

        const { password_hash, ...result } = newUser;
        return result;
    }

    async validateUser(email: string, pass: string): Promise<Omit<User, 'password' | 'password_hash'> | null> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password_hash)) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

        this.usersService.update(user.id, { refresh_token });
        return { access_token, refresh_token };
    }
}