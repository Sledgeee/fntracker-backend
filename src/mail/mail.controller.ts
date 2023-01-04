import { Controller, Get, Query } from '@nestjs/common'
import { MailSmtpService } from './mail-smtp.service'
import { GetUser, GetUserId, Public } from '../common/decorators'
import { I18n, I18nContext } from 'nestjs-i18n'
import { MailSendgridService } from './mail-sendgrid.service'
import { JwtPayload } from '../auth/types'

@Controller('mail')
export class MailController {
	constructor(
		private readonly mailSmtpService: MailSmtpService,
		private readonly mailSendGridService: MailSendgridService
	) {}

	@Get('smtp/activate/resend')
	async smtpResendActivateMail(
		@GetUser() user: JwtPayload,
		@I18n() i18n: I18nContext,
		@GetUserId() userId: number
	) {
		return user.isVerified
			? i18n.t('api-user.AccountActivated')
			: this.mailSmtpService.sendActivationMail(
					userId,
					user.email,
					'',
					'',
					i18n,
					true
			  )
	}

	@Get('sd/activate/resend')
	async sdResendActivateMail(
		@GetUser() user: JwtPayload,
		@I18n() i18n: I18nContext,
		@GetUserId() userId: number
	) {
		return user.isVerified
			? i18n.t('api-user.AccountActivated')
			: this.mailSendGridService.sendActivationMail(
					userId,
					user.email,
					'',
					'',
					i18n,
					true
			  )
	}

	@Public()
	@Get('smtp/recovery')
	async smtpSendRecoveryMail(@Query() query, @I18n() i18n: I18nContext) {
		return this.mailSmtpService.sendResetMail(query.email, i18n)
	}

	@Public()
	@Get('sd/recovery')
	async sdSendRecoveryMail(@Query() query, @I18n() i18n: I18nContext) {
		return this.mailSendGridService.sendResetMail(query.email, i18n)
	}
}
