import { Module } from '@nestjs/common'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileEntity } from './entities/profile.entity'
import { ProfileSocialNetworksEntity } from './entities/profile-social-networks.entity'
import { ProfileViewsEntity } from './entities/profile-views.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ProfileEntity,
			ProfileSocialNetworksEntity,
			ProfileViewsEntity
		])
	],
	controllers: [ProfileController],
	providers: [ProfileService]
})
export class ProfileModule {}
