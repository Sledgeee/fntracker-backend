import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { activateTemplate, otpTemplate } from './templates'
import * as SendGrid from '@sendgrid/mail'
import { I18nContext } from 'nestjs-i18n'
import { MailHelperService } from './mail-helper.service'

@Injectable()
export class MailSendgridService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		private readonly mailHelperService: MailHelperService
	) {
		SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_API_KEY'))
	}

	async sendActivationMail(
		userId: number,
		to: string,
		egsId: string,
		country: string,
		i18n: I18nContext,
		isResend: boolean = false
	) {
		const al = await this.mailHelperService.createActivationLink(
			userId,
			egsId,
			country,
			isResend
		)
		const link = `${this.configService.get(
			'CLIENT_URL'
		)}/user/activate?uid=${userId}&al=${al}`
		new Promise(() =>
			SendGrid.send({
				from: this.configService.get<string>('SEND_GRID_MAIL_BOX'),
				to: to,
				subject: `${i18n.t(
					'api-email.AccountActivation'
				)} - ${this.configService.get('APP_NAME')}`,
				html: activateTemplate(
					this.configService.get('CLIENT_URL'),
					this.configService.get('APP_NAME'),
					link,
					!isResend
						? i18n.t('api-email.FinishRegister')
						: i18n.t('api-email.NewActivateAccountMail'),
					i18n.t('api-email.ActivateAccount'),
					i18n.t('api-email.ProblemActivate'),
					i18n.t('api-email.AutomaticMail'),
					i18n.t('api-email.Rights')
				)
			})
		)
	}

	async sendResetMail(
		email: string,
		i18n: I18nContext,
		isResend: boolean = false
	) {
		const link = `${this.configService.get(
			'CLIENT_URL'
		)}/${await this.mailHelperService.createRecoveryLink(email)}`
		await SendGrid.send({
			from: this.configService.get<string>('SEND_GRID_MAIL_BOX'),
			to: email,
			subject: `${i18n.t(
				'api-email.PasswordResetting'
			)} - ${this.configService.get('APP_NAME')}`,
			html: otpTemplate(
				this.configService.get('CLIENT_URL'),
				this.configService.get('APP_NAME'),
				link,
				!isResend
					? i18n.t('api-email.PasswordResetting')
					: i18n.t('api-email.NewResetPasswordMail'),
				i18n.t('api-email.ResetPassword'),
				i18n.t('api-email.ProblemReset'),
				i18n.t('api-email.AutomaticMail'),
				i18n.t('api-email.Rights')
			)
		})
		return HttpStatus.OK
	}
}
