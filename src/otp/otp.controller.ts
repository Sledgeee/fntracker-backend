import { Body, Controller, Post } from '@nestjs/common'
import { OtpService } from './otp.service'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { Public } from '../common/decorators'

@Public()
@Controller('otp')
export class OtpController {
	constructor(private readonly otpService: OtpService) {}

	@Post('verify')
	async verifyOtp(@Body() dto: VerifyOtpDto) {
		return this.otpService.verifyOtp(dto)
	}
}
