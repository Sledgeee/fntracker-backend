import { Inject, Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import { ConfigService } from '@nestjs/config'
import { activate } from './templates'
import { InjectRepository } from '@nestjs/typeorm'
import { ActivationLinkEntity } from './activation-link.entity'
import { Repository } from 'typeorm'
import { I18nContext } from 'nestjs-i18n'
import { MailHelperService } from './mail-helper.service'

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

	sendActivationMail(
		userId,
		to,
		egsId,
		country,
		i18n: I18nContext,
		isResend = false
	) {
		let link
		this.mailHelperService
			.createActivationLink(userId, egsId, country, isResend)
			.then(res => {
				link = `${this.configService.get(
					'API_URL'
				)}/user/activate?uid=${userId}&al=${res}`
			})
		this.transporter.sendMail({
			from: this.configService.get('MAIL_USER'),
			to: to,
			subject: `${i18n.t(
				'api-email.AccountActivation'
			)} - ${this.configService.get('APP_NAME')}`,
			text: '',
			html: activate(
				this.configService.get('CLIENT_URL'),
				this.configService.get('APP_NAME'),
				link,
				!isResend
					? i18n.t('api-email.FinishRegister')
					: i18n.t('api-email.NewMail'),
				i18n.t('api-email.ActivateAccount'),
				i18n.t('api-email.Regards'),
				i18n.t('api-email.Problem'),
				i18n.t('api-email.AutomaticMail'),
				i18n.t('api-email.Rights')
			)
		})
	}
}
