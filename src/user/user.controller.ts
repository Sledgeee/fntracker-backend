import { Controller, Get, Query, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { GetUserId, Public } from '../common/decorators'
import { UserEntity } from './user.entity'
import { I18n, I18nContext } from 'nestjs-i18n'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@Get('activate')
	async activateUser(@Query() q, @Res() res, @I18n() i18n: I18nContext) {
		return await this.userService.activateUser(
			q['uid'],
			q['al'],
			q['egsId'],
			q['country'],
			i18n,
			res
		)
	}

	@Get('profile')
	getUser(@GetUserId() id: number): Promise<UserEntity> {
		return this.userService.getProfile(id)
	}
}
