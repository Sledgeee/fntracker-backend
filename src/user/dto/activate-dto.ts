import { IsNotEmpty } from 'class-validator'

export class ActivateDto {
	@IsNotEmpty()
	uid: number
	@IsNotEmpty()
	al: string
	@IsNotEmpty()
	egsId: string
	@IsNotEmpty()
	country: string
}
