import { IsOptional } from 'class-validator'

export class UpdateSocialNetworksDto {
	@IsOptional()
	youtube: string
	@IsOptional()
	twitch: string
	@IsOptional()
	twitter: string
	@IsOptional()
	instagram: string
	@IsOptional()
	telegram: string
}
