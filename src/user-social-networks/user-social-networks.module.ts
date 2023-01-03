import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserSocialNetworksEntity } from './user-social-networks.entity'
import { UserSocialNetworksController } from './user-social-networks.controller'
import { UserSocialNetworksService } from './user-social-networks.service'
import { UserEntity } from '../user/user.entity'

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserSocialNetworksEntity, UserEntity])
	],
	controllers: [UserSocialNetworksController],
	providers: [UserSocialNetworksService]
})
export class UserSocialNetworksModule {}
