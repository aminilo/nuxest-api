import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Security')
@Controller('csrf')
export class CsrfController {
	@Get('csrf-token')
	@ApiOperation({ summary: 'Get CSRF Token' })
	@ApiResponse({ status: 200,  description: 'CSRF Token retrieved successfully!' })
	getCsrfToken(@Req() req, @Res() res) {
		const token = req.csrfToken();
		res.cookie('XSRF-TOKEN', token);
		return res.json({ csrfToken: token });
	}
}
