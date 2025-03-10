import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsUrl()
  longUrl: string;
}
