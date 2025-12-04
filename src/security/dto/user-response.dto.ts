import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'OWNER', enum: ['ADMIN', 'OWNER', 'GUEST'] })
  role: string;

  @ApiProperty({ example: '2025-12-04T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-04T10:00:00.000Z' })
  updatedAt: Date;
}
