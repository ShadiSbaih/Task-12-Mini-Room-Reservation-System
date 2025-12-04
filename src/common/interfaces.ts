export interface JwtPayload {
  sub: number;
  role: string;
}

export interface RequestUser {
  userId: number;
  role: string;
}
