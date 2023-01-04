import { IsEmail, IsNotEmpty } from 'class-validator'

export class RecoveryDto {
	@IsNotEmpty()
	uid: number
	@IsNotEmpty()
	otp: string
	@IsNotEmpty()
	password: string
	@IsNotEmpty()
	@IsEmail()
	email: string
	@IsNotEmpty()
	recid: number
}
