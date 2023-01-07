import { IsNotEmpty } from 'class-validator'

export class UpdateProfileDto {
	@IsNotEmpty()
	country: string
	@IsNotEmpty()
	avatar: string
	@IsNotEmpty()
	fullName: string
}
