import { Controller, Request, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto, ResponsePropertyDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Property CRUD')
@Controller('properties')
export class PropertiesController {
  constructor(private svc: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/property-images',
      filename: (_, file, cb) => {
        const name = `property-${Date.now()}${extname(file.originalname)}`;
        cb(null, name);
      }
    })
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new property with optional image' })
  @ApiResponse({ status: 201, type: ResponsePropertyDto, description: 'Property created successfully' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePropertyDto,
    @Request() req
  ): Promise<ResponsePropertyDto> {
    return this.svc.create({
      ...dto,
      image: file ? `/uploads/property-images/${file.filename}` : undefined
    }, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties (paginated)' })
  @ApiResponse({ status: 200, type: [ResponsePropertyDto], description: 'Properties retrieved successfully' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ): Promise<ResponsePropertyDto[]> {
    return this.svc.findAll(Number(skip) || 0, Number(take) || 10);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all properties owned by the current user' })
  @ApiResponse({ status: 200, type: [ResponsePropertyDto], description: 'Properties owned by user' })
  async findMine(@Request() req): Promise<ResponsePropertyDto[]> {
    return this.svc.findByOwner(req.user.sub);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get one property by slug' })
  @ApiParam({ name: 'slug', type: 'string', description: 'Unique property slug' })
  @ApiResponse({ status: 200, type: ResponsePropertyDto, description: 'Returns property details' })
  async findOne(@Param('slug') slug: string): Promise<ResponsePropertyDto> {
    return this.svc.findOne(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/property-images',
      filename: (_, file, cb) => {
        const name = `property-${Date.now()}${extname(file.originalname)}`;
        cb(null, name);
      }
    })
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an existing property by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Property UUID' })
  @HttpCode(204)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdatePropertyDto,
    @Request() req
  ): Promise<void> {
    await this.svc.update(
      id,
      {
        ...dto,
        image: file ? `/uploads/property-images/${file.filename}` : dto.image
      },
      req.user.sub
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete property by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Property UUID' })
  @HttpCode(204)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req
  ): Promise<void> {
    await this.svc.remove(id, req.user.sub);
  }
}
