import { Body, Controller, Patch } from '@nestjs/common'
import { UserSocialNetworksService } from './user-social-networks.service'
import { UpdateSocialNetworksDto } from './update-social-networks.dto'
import { GetUserId } from '../common/decorators'

@Controller('sn')
export class UserSocialNetworksController {
	constructor(
		private readonly userSocialNetworksService: UserSocialNetworksService
	) {}

	@Patch()
	async updateSocialNetworks(
		@GetUserId() userId,
		@Body() dto: UpdateSocialNetworksDto
	) {
		return this.userSocialNetworksService.updateSocialNetworks(userId, dto)
	}
}
