import { Request, Res, Body, Controller, Get, Post, Patch, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response, Express } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto, UserDto } from './dto';
import { JwtAuthGuard } from './jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully, returns JWT token' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and set auth cookie' })
  @ApiResponse({ status: 200, description: 'Logged in successfully, auth cookie set' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(dto);
    const token = this.authService.signPayload(user.id, user.email);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return { message: 'Logged in successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout current user by clearing auth cookie' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production'
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user\'s profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserDto, description: 'Returns current user profile' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dest = join(__dirname, '..', '..', '..', 'uploads', 'user-avatars');
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
      }
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  @ApiOperation({ summary: 'Update current user\'s profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Profile updated successfully' })
  updateProfile(@UploadedFile() file: Express.Multer.File, @Body() dto: UpdateProfileDto, @Request() req) {
    if (file) dto.avatar = `/uploads/user-avatars/${file.filename}`;
    return this.authService.updateProfile(req.user.sub, dto);
  }
}
