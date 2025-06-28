import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.member.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}
