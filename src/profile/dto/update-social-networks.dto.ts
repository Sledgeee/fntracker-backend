import { IsNotEmpty } from 'class-validator'

export class UpdateSocialNetworksDto {
	@IsNotEmpty()
	youtube: string
	@IsNotEmpty()
	twitch: string
	@IsNotEmpty()
	twitter: string
	@IsNotEmpty()
	instagram: string
	@IsNotEmpty()
	telegram: string
}
