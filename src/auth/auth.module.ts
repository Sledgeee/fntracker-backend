import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { AtStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'
import { ActivationLinkEntity } from '../mail/activation-link.entity'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { I18nContext } from 'nestjs-i18n'
import { UserService } from '../user'
import { MailSendgridService } from '../mail/mail-sendgrid.service'
import { MailHelperService } from '../mail/mail-helper.service'
import { OtpEntity } from '../otp/otp.entity'

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		MailHelperService,
		MailSendgridService,
		UserService,
		AtStrategy,
		I18nContext
	],
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([
			UserEntity,
			ActivationLinkEntity,
			ProfileEntity,
			OtpEntity
		]),
		JwtModule.register({})
	]
})
export class AuthModule {}
