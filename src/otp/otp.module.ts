import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { ActivationLinkEntity } from '../mail/activation-link.entity'
import { OtpEntity } from './otp.entity'

import { OtpService } from './otp.service'
import { OtpController } from './otp.controller'

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserEntity, ActivationLinkEntity, OtpEntity])
	],
	controllers: [OtpController],
	providers: [OtpService]
})
export class OtpModule {}
