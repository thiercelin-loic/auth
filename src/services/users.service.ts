import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import speakeasy from 'speakeasy';
import { UpdateUserDto } from '../validators/update-user.dto';
import { User } from '../validators/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }
    async create(userData: Partial<User>) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find();
    }
    async disableMfa(id: any, code: string) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.mfa_enabled) {
            throw new BadRequestException('MFA is not enabled for this user');
        }

        const verified = this.verifyMfaCode(user, code);

        if (!verified) {
            throw new BadRequestException('Invalid MFA code');
        }

        await this.userRepository.update(id, {
            mfa_enabled: false,
            mfa_secret: undefined
        });

        return { success: true, message: 'MFA disabled successfully' };
    }

    private verifyMfaCode(user: User, code: string): boolean {
        if (!user.mfa_secret) {
            return false;
        }

        try {
            return speakeasy.totp.verify({
                secret: user.mfa_secret,
                encoding: 'base32',
                token: code,
                window: 1
            });
        } catch (error) {
            console.error('MFA verification error:', error);
            return false;
        }
    }

    async verifyAndEnableMfa(id: any, code: string) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.mfa_enabled) {
            throw new BadRequestException('MFA is already enabled for this user');
        }

        if (!user.mfa_secret) {
            throw new BadRequestException('MFA secret not generated');
        }

        const verified = this.verifyMfaCode(user, code);

        if (!verified) {
            throw new BadRequestException('Invalid MFA code');
        }

        await this.userRepository.update(id, {
            mfa_enabled: true
        });

        return { success: true, message: 'MFA enabled successfully' };
    }

    async generateMfaSecret(id: any) {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.mfa_enabled) {
            throw new BadRequestException('MFA is already enabled for this user');
        }

        const secret = speakeasy.generateSecret({
            name: `MyApp:${user.email}`
        });

        await this.userRepository.update(id, {
            mfa_secret: secret.base32
        });

        return {
            secret: secret.base32,
            otpauth_url: secret.otpauth_url
        };
    }

    update(id: any, updateUserDto: UpdateUserDto) {
        console.log('Updating user with ID:', id, 'with data:', updateUserDto);
        return this.userRepository.update(id, updateUserDto);
    }

    async findById(id: any) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email }
        });
        return user;
    }
}
