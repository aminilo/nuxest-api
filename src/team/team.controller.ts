import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamMemberDto } from './dto';
import { TeamService } from './team.service';

@ApiTags('Team Members')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({
    status: 200,
    type: [TeamMemberDto],
    description: 'Members retrieved successfully'
  })
  getAllTeamMembers() {
    return this.teamService.findAll();
  }
}
