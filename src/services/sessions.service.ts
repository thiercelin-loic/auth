import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../validators/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) { }
  async findByUserId(userId: string) {
    const sessions = await this.sessionsRepository.find({ where: { user: { id: userId } } });
    return sessions;
  }

  async delete(sessionId: string, userId: string) {
    const result = await this.sessionsRepository.delete({
      id: sessionId,
      user: { id: userId }
    });

    return (result.affected ?? 0) > 0;
  }
}
