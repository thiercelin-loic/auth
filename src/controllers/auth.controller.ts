import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    HttpCode,
    UnauthorizedException,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RegisterDto } from '../validators/register.dto';
import { ForgotPasswordDto } from '../validators/forgot-password.dto';
import { ResetPasswordDto } from '../validators/reset-password.dto';
import { VerifyEmailDto } from '../validators/verify-email.dto';
import { ApiBody, ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ schema: { properties: { email: { type: 'string', example: 'user@example.com' }, password: { type: 'string', example: 'Password123!' } }, required: ['email', 'password'] } })
    @ApiResponse({ status: 200, description: 'JWT access token' })
    async login(@Request() req, @Res({ passthrough: true }) response: Response) {
        const { access_token } = await this.authService.login(req.user);
        return { access_token };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logout user (requires JWT and refresh_token cookie)' })
    @ApiBearerAuth()
    @ApiCookieAuth('refresh_token')
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    async logout(@Request() req, @Res({ passthrough: true }) response: Response) {
        this.authService.logout(req.user.id, req.cookies.refresh_token);
        response.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @Post('refresh-token')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get new access token using refresh token (cookie)' })
    @ApiCookieAuth('refresh_token')
    @ApiResponse({ status: 200, description: 'Returns new access token and sets new refresh token cookie' })
    async refreshToken(
        @Request() req,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }

        const { access_token, refresh_token } = await this.authService.refreshToken(refreshToken);

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token };
    }

    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @Post('forgot-password')
    @HttpCode(200)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        this.authService.forgotPassword(forgotPasswordDto.email);
        return { message: 'If your email is registered, you will receive a password reset link' };
    }

    @Post('reset-password')
    @HttpCode(200)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.password
        );
        return { message: 'Password has been reset successfully' };
    }
    
    @Post('verify-email')
    @HttpCode(200)
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        await this.authService.verifyEmail(verifyEmailDto.token);
        return { message: 'Email verified successfully' };
    }
}
