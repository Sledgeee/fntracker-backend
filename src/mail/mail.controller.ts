import { Controller, Get, Param, Query } from '@nestjs/common'
import { MailSmtpService } from './mail-smtp.service'
import { GetUser, GetUserId, Public } from '../common/decorators'
import { I18n, I18nContext } from 'nestjs-i18n'
import { MailSendgridService } from './mail-sendgrid.service'
import { JwtPayload } from '../auth/types'

@Controller('mail/:service')
export class MailController {
	constructor(
		private readonly mailSmtpService: MailSmtpService,
		private readonly mailSendGridService: MailSendgridService
	) {}

	@Get('activate/resend')
	async resendActivateMail(
		@Param() params,
		@GetUser() user: JwtPayload,
		@I18n() i18n: I18nContext,
		@GetUserId() userId: number
	) {
		return user.isVerified
			? i18n.t('api-user.AccountActivated')
			: params.service === 'smtp'
			? this.mailSmtpService.sendActivationMail(
					userId,
					user.email,
					'',
					'',
					i18n,
					true
			  )
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
	@Get('recovery')
	async sendRecoveryMail(
		@Param() params,
		@Query() query,
		@I18n() i18n: I18nContext
	) {
		return params.service === 'smtp'
			? this.mailSmtpService.sendRecoveryMail(query.email, i18n)
			: this.mailSendGridService.sendRecoveryMail(query.email, i18n)
	}
}
