import { IsNotEmpty } from 'class-validator'
import { Optional } from '@nestjs/common'

export class UpdateProfileDto {
	@IsNotEmpty()
	country: string
	@Optional()
	avatar: string
	@Optional()
	fullName: string
}
