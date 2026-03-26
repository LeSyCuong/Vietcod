import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyInfoDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
