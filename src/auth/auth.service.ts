import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: { ...dto, password: await bcrypt.hash(dto.password, 11) }
    });
    return this.signPayload(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if( !user || !(await bcrypt.compare(dto.password, user.password)) ) throw new UnauthorizedException('Invalid credentials');
    return { id: user.id, email: user.email };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if(!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user;
    return rest;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if(dto.password) dto.password = await bcrypt.hash(dto.password, 11);
    await this.prisma.user.update({ where: { id: userId }, data: dto });
    return null;
  }

  public signPayload(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
