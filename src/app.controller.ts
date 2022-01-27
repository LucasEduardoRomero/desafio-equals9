import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthDto } from './auth/auth.dto';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() user: AuthDto) {
    return this.authService.login(user);
  }
}
