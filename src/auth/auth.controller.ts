import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	Req,
	Res
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto, RegisterDto } from './dto'
import { AuthResponse } from './types'
import { GetUserId, Public } from '../common/decorators'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { UserService } from '../user'
import { I18n, I18nContext } from 'nestjs-i18n'

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(ConfigService) private readonly configService: ConfigService,
		@Inject(UserService) private readonly userService: UserService
	) {}

	@HttpCode(HttpStatus.CREATED)
	@Public()
	@Post('register')
	async register(
		@Body() dto: RegisterDto,
		@I18n() i18n: I18nContext,
		@Res({ passthrough: true }) response: Response
	) {
		const authResponse: AuthResponse = await this.authService.register(
			dto,
			i18n
		)
		this.authService.setCookie(response, authResponse.refreshToken)
		const user = await this.userService.getProfile(authResponse.userId)
		return {
			user,
			accessToken: authResponse.accessToken
		}
	}

	@HttpCode(HttpStatus.OK)
	@Public()
	@Post('login')
	async login(
		@Body() dto: AuthDto,
		@I18n() i18n: I18nContext,
		@Res({ passthrough: true }) response: Response
	) {
		const authResponse: AuthResponse = await this.authService.login(dto, i18n)
		this.authService.setCookie(response, authResponse.refreshToken)
		const user = await this.userService.getProfile(authResponse.userId)
		return {
			user,
			accessToken: authResponse.accessToken
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	async logout(
		@GetUserId() userId: number,
		@Res({ passthrough: true }) response: Response
	) {
		await this.authService.logout(userId)
		this.authService.clearCookie(response)
	}

	@HttpCode(HttpStatus.OK)
	@Public()
	@Post('refresh')
	async refresh(
		@Req() req,
		@I18n() i18n: I18nContext,
		@Res({ passthrough: true }) response: Response
	) {
		const { refreshToken } = req.cookies
		const refreshResponse = await this.authService.refresh(refreshToken, i18n)
		this.authService.setCookie(response, refreshResponse.refreshToken)
		return {
			accessToken: refreshResponse.accessToken
		}
	}
}
