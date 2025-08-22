import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
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
        throw new Error('Method not implemented.');
    }
    async findById(id: any) {
        return Promise.resolve({
            id,
            username: 'testuser',
            password: await bcrypt.hash('testpassword', 10),
        });
    }
    async findByUsername(username: string) {
        return Promise.resolve({
            id: 1,
            username,
            password: await bcrypt.hash('testpassword', 10),
        });
    }
}
