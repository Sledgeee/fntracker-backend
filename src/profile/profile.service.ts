import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProfileEntity } from './profile.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>
	) {}

	async getProfile(user) {
		return await this.profileRepository.findOneBy({ user: user })
	}

	async updateProfileImage(user, avatar) {
		const profile = await this.profileRepository.findOneBy({ user: user })
		if (!profile) throw new BadRequestException('Profile doest not exists')
		if (!avatar) throw new BadRequestException('Empty avatar src')
		profile.avatar = avatar
		return await this.profileRepository.save(profile)
	}
}
