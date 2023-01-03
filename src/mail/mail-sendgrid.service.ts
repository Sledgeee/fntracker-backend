import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { activate } from './templates'
import * as SendGrid from '@sendgrid/mail'
import { I18nContext } from 'nestjs-i18n'
import { MailHelperService } from './mail-helper.service'

@Injectable()
export class MailSendgridService {
	constructor(
		@Inject(ConfigService) private readonly configService: ConfigService,
		private readonly mailHelperService: MailHelperService
	) {
		SendGrid.setApiKey(this.configService.get('SEND_GRID_API_KEY'))
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

		SendGrid.send({
			from: this.configService.get('SEND_GRID_MAIL_BOX'),
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
