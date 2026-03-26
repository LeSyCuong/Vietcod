// src/account/dto/user.dto.ts
export class UserDto {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  vnd: number;
}
