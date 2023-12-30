import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AccessTokenGuard } from './guards/accessToken.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async signin(@Body() authDto: AuthDto) {
    return await this.authService.logIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('logout')
  async logout(@Req() req: Request) {
    const userId = req.user['sub'];
    return await this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.issueNewTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Patch('password')
  async changePassword(@Body() passwordDto, @Req() req: Request) {
    return await this.authService.changePassword(req.user['sub'], passwordDto);
  }
}
