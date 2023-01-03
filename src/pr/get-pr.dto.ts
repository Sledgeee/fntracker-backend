import { IsNotEmpty } from 'class-validator'

export class GetPrDto {
	@IsNotEmpty()
	platform: string

	@IsNotEmpty()
	region: string

	@IsNotEmpty()
	egsName: string
}
