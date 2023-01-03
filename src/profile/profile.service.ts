import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProfileEntity } from './profile.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>
	) {}

	async getProfile(user): Promise<ProfileEntity> {
		return await this.profileRepository.findOneBy({ user: user })
	}
}
