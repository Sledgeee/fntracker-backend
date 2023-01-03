import { Module } from '@nestjs/common'
import { MailSmtpService } from './mail-smtp.service'
import { MailController } from './mail.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { ActivationLinkEntity } from './activation-link.entity'
import { MailSendgridService } from './mail-sendgrid.service'
import { I18nContext } from 'nestjs-i18n'
import { MailHelperService } from './mail-helper.service'

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserEntity, ActivationLinkEntity])
	],
	controllers: [MailController],
	providers: [
		MailHelperService,
		MailSmtpService,
		MailSendgridService,
		I18nContext
	]
})
export class MailModule {}
