import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { GetUserId, Public } from '../common/decorators'
import { I18n, I18nContext } from 'nestjs-i18n'
import { ActivateDto } from './dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@Get('activate')
	async activateUser(@Query() dto: ActivateDto, @I18n() i18n: I18nContext) {
		return await this.userService.activateUser(dto, i18n)
	}

	@Get('profile')
	async getUser(@GetUserId() id) {
		return this.userService.getProfile(id)
	}
}
