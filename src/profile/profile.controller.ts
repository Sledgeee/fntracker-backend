import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { GetUserId, Public } from '../common/decorators'
import { ProfileService } from './profile.service'
import { UpdateProfileDto } from './update-profile.dto'

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
		return this.profileService.updateProfileImage(userId, dto)
	}

	@Patch('views/increment')
	async incrementViews(@Query() query) {
		return this.profileService.incrementViews(query.egsId)
	}
}
