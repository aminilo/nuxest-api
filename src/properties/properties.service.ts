import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto, ResponsePropertyDto } from './dto';
import { transformProperty } from '../utils/transformers';
import { slugify } from '../utils/slugify';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  private async buildUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let slug = base;
    let count = 1;
    while (await this.prisma.property.findUnique({ where: { slug } })) {
      slug = `${base}-${count++}`;
    }
    return slug;
  }

  async create(dto: CreatePropertyDto, ownerId: string): Promise<ResponsePropertyDto> {
    const slug = await this.buildUniqueSlug(dto.title);
    const data = { ...dto, ownerId, slug };
    if(!data.image) delete data.image;
    if(!data.phone) delete data.phone;
    const created = await this.prisma.property.create({ data });
    const { ownerId: _, ...rest } = created;
    return transformProperty(rest);
  }

  async findAll(skip = 0, take = 10): Promise<ResponsePropertyDto[]> {
    const list = await this.prisma.property.findMany({
      skip, take, orderBy: { createdAt: 'desc' }
    });
    return list.map(({ ownerId, ...p }) => transformProperty(p));
  }

  async findOne(slug: string): Promise<ResponsePropertyDto> {
    const p = await this.prisma.property.findUnique({ where: { slug } });
    if(!p) throw new NotFoundException(`Property not found: ${slug}`);
    const { ownerId, ...rest } = p;
    return transformProperty(rest);
  }

  async update(id: string, dto: UpdatePropertyDto, userId: string): Promise<void> {
    const p = await this.prisma.property.findUnique({ where: { id } });
    if(!p) throw new NotFoundException(`Property not found with ID: ${id}`);
    if(p.ownerId !== userId) throw new ForbiddenException('You do not own this property');
    const data: any = { ...dto };
    if(data.image == null) delete data.image;
    if(data.phone == null) delete data.phone;
    await this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string, userId: string): Promise<void> {
    const p = await this.prisma.property.findUnique({ where: { id } });
    if(!p) throw new NotFoundException(`Property not found with ID: ${id}`);
    if(p.ownerId !== userId) throw new ForbiddenException('You do not own this property');
    await this.prisma.property.delete({ where: { id } });
  }

  async findByOwner(userId: string): Promise<ResponsePropertyDto[]> {
    const list = await this.prisma.property.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    return list.map(({ ownerId, ...p }) => transformProperty(p));
  }
}
