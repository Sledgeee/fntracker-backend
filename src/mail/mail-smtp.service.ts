import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { ActivationLinkEntity } from './activation-link.entity'
import { Repository } from 'typeorm'
import { I18nContext } from 'nestjs-i18n'
import { MailHelperService } from './mail-helper.service'
import { activateTemplate, otpTemplate } from './templates'

@Injectable()
export class MailSmtpService {
	private readonly transporter: Transporter = null

	constructor(
		@Inject(ConfigService) private readonly configService: ConfigService,
		@InjectRepository(ActivationLinkEntity)
		private readonly activationLinkRepository: Repository<ActivationLinkEntity>,
		private readonly mailHelperService: MailHelperService
	) {
		this.transporter = createTransport({
			host: configService.get('MAIL_HOST'),
			port: configService.get('MAIL_PORT'),
			secure: false,
			auth: {
				user: configService.get('MAIL_USER'),
				pass: configService.get('MAIL_PASS')
			}
		})
	}

	async sendActivationMail(
		userId,
		to,
		egsId,
		country,
		i18n: I18nContext,
		isResend = false
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

		return new Promise(() =>
			this.transporter.sendMail({
				from: this.configService.get('MAIL_USER'),
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
						: i18n.t('api-email.NewMail'),
					i18n.t('api-email.ActivateAccount'),
					i18n.t('api-email.Problem'),
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
		await this.transporter.sendMail({
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
