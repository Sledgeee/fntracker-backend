import { IsNotEmpty } from 'class-validator'
import { Optional } from '@nestjs/common'

export class UpdateProfileDto {
	@IsNotEmpty()
	country: string
	@Optional()
	gradient: string
	@Optional()
	avatar: string
	@Optional()
	fullName: string
}
