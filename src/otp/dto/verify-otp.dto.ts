import { IsNotEmpty } from 'class-validator'

export class VerifyOtpDto {
	@IsNotEmpty()
	otpId: number
	@IsNotEmpty()
	userId: number
	@IsNotEmpty()
	otp: string
}
