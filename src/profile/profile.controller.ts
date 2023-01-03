import { Body, Controller, Get, Patch } from '@nestjs/common'
import { GetUser, Public } from '../common/decorators'
import { ProfileService } from './profile.service'

@Public()
@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	getProfile(@GetUser() user) {
		return this.profileService.getProfile(user)
	}

	@Patch()
	updateProfileImage(@GetUser() user, @Body() avatar: string) {
		return this.profileService.updateProfileImage(user, avatar)
	}
}
