import { Controller, Get } from '@nestjs/common'
import { MailSmtpService } from './mail-smtp.service'
import { GetUser, GetUserId } from '../common/decorators'
import { I18n, I18nContext } from 'nestjs-i18n'
import { MailSendgridService } from './mail-sendgrid.service'

@Controller('mail')
export class MailController {
	constructor(
		private readonly mailSmtpService: MailSmtpService,
		private readonly mailSendGridService: MailSendgridService
	) {}

	@Get('smtp/activate/resend')
	async smtpResendActivationLink(
		@GetUser('email') email: string,
		@I18n() i18n: I18nContext,
		@GetUserId() userId: number,
		isVerified: boolean = false
	) {
		return isVerified
			? i18n.t('api-user.AccountActivated')
			: this.mailSmtpService.sendActivationMail(
					userId,
					email,
					'',
					'',
					i18n,
					true
			  )
	}

	@Get('sd/activate/resend')
	async sendGridResendActivationLink(
		@GetUser('email') email: string,
		@I18n() i18n: I18nContext,
		@GetUserId() userId: number,
		isVerified: boolean = false
	) {
		return isVerified
			? i18n.t('api-user.AccountActivated')
			: this.mailSendGridService.sendActivationMail(
					userId,
					email,
					'',
					'',
					i18n,
					true
			  )
	}
}
