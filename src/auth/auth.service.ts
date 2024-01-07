import * as argon2 from 'argon2';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDto: AuthDto) {
    const hashedPassword = await this.hashData(authDto.password);
    const createdUser = await this.usersService.create({
      ...authDto,
      password: hashedPassword,
    });
    return createdUser;
  }

  async logIn(authDto: AuthDto) {
    const user = await this.usersService.findOneByField('email', authDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      authDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.issueTokens(payload);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshToken: null });
  }

  async changePassword(userId: string, updateAuthDto: UpdateAuthDto) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const checkOldpassword = await argon2.verify(
      user.password,
      updateAuthDto.oldPassword,
    );
    if (!checkOldpassword) {
      throw new UnauthorizedException('현재 비밀번호가 맞지 않습니다.');
    }

    // const cheackNewPassword = await argon2.verify(
    //   user.password,
    //   updateAuthDto.newPassword,
    // );
    // if (cheackNewPassword) {
    //   throw new UnauthorizedException(
    //     '기존 비밀번호와 새로운 비밀번호가 일치합니다.',
    //   );
    // }

    const hashedPassword = await this.hashData(updateAuthDto.newPassword);
    await this.usersService.update(userId, { password: hashedPassword });
    return { message: 'Password changed successfully' };
  }

  /* 여기서부터는 토큰 발급을 담당하는 메서드입니다. */

  hashData(data: string) {
    return argon2.hash(data);
  }

  async issueTokens(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return { accessToken, refreshToken };
  }

  async issueNewTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        'Refresh token does not match the stored token',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.issueTokens(payload);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });
    return tokens;
  }
}
