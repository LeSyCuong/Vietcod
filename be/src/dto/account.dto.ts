// src/account/dto/create-account.dto.ts
export class AccountDto {
  id: number;
  username: string;
  email: string;
  password: string;
  phone?: string;
  vnd: number;
}
