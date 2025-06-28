import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  bio?: string;
}

export class TeamMemberDto {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  createdAt: Date;
}
