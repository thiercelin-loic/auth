import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    findAll() {
        throw new Error('Method not implemented.');
    }
    disableMfa(id: any, code: string) {
        throw new Error('Method not implemented.');
    }
    verifyAndEnableMfa(id: any, code: string) {
        throw new Error('Method not implemented.');
    }
    generateMfaSecret(id: any) {
        throw new Error('Method not implemented.');
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
