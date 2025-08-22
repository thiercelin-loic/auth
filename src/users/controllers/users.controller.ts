import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from '../users.service';

import { SessionsService } from '../services/sessions.service';

import { UpdateUserDto } from '../dto/update-user.dto';
import { VerifyMfaDto } from '../dto/verify-mfa.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Post('mfa/enable')
  async enableMfa(@Request() req) {
    const secret = await this.usersService.generateMfaSecret(req.user.id);
    return { secret };
  }

  @Post('mfa/verify')
  async verifyMfa(@Request() req, @Body() verifyMfaDto: VerifyMfaDto) {
    await this.usersService.verifyAndEnableMfa(
      req.user.id,
      verifyMfaDto.code,
    );
    return { message: 'MFA enabled successfully' };
  }

  @Post('mfa/disable')
  async disableMfa(@Request() req, @Body() verifyMfaDto: VerifyMfaDto) {
    await this.usersService.disableMfa(req.user.id, verifyMfaDto.code);
    return { message: 'MFA disabled successfully' };
  }

  @Get('sessions')
  async getSessions(@Request() req) {
    return this.sessionsService.findByUserId(req.user.id);
  }

  @Delete('sessions/:id')
  async deleteSession(@Request() req, @Param('id') id: string) {
    await this.sessionsService.delete(id, req.user.id);
    return { message: 'Session deleted successfully' };
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
