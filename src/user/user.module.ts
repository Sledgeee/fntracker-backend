import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { ConfigModule } from '@nestjs/config'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { ActivationLinkEntity } from '../mail/activation-link.entity'
import { ProfileSocialNetworksEntity } from '../profile/entities/profile-social-networks.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			ProfileEntity,
			ActivationLinkEntity,
			ProfileSocialNetworksEntity
		]),
		ConfigModule
	],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
