import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() body: any) {
        return this.authService.signup(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body: any) {
        return this.authService.login(body.email, body.password)
    }
}
