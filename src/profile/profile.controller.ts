import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { GetUserId, Public } from '../common/decorators'
import { ProfileService } from './profile.service'
import { UpdateProfileDto, UpdateSocialNetworksDto } from './dto'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Public()
	@Get(':egsId')
	async getProfile(@Param() params) {
		return this.profileService.getProfile(params.egsId)
	}

	@Patch()
	async updateProfile(@GetUserId() userId, @Body() dto: UpdateProfileDto) {
		return this.profileService.updateProfile(userId, dto)
	}

	@Public()
	@Patch(':egsId/increment')
	async incrementViews(@Param() params) {
		return this.profileService.incrementViews(params.egsId)
	}

	@Patch('sn')
	async updateSocialNetworks(
		@GetUserId() userId,
		@Body() dto: UpdateSocialNetworksDto
	) {
		return this.profileService.updateProfileSocialNetworks(userId, dto)
	}
}
