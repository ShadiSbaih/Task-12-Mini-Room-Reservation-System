import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../common/enums';

class RegisterDto {
  @ApiProperty({ example: 'owner@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'Owner123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Object.values(Role), example: Role.OWNER })
  @IsEnum(Role)
  role: Role;
}

class LoginDto {
  @ApiProperty({ example: 'owner@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Owner123!' })
  @IsString()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (OWNER or GUEST)' })
  @ApiCreatedResponse({ description: 'User registered' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.role);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive JWT access token' })
  @ApiOkResponse({ description: 'Authenticated' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
