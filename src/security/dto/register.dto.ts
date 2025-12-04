import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums';

export class RegisterDto {
  @ApiProperty({ example: 'owner@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'Owner123!', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Role, example: Role.OWNER, description: 'User role (OWNER or GUEST)' })
  @IsEnum(Role)
  role: Role;
}
