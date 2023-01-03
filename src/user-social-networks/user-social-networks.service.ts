import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserSocialNetworksEntity } from './user-social-networks.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateSocialNetworksDto } from './update-social-networks.dto'

@Injectable()
export class UserSocialNetworksService {
	constructor(
		@InjectRepository(UserSocialNetworksEntity)
		private readonly linkedAccountRepository: Repository<UserSocialNetworksEntity>
	) {}

	async updateSocialNetworks(userId, dto: UpdateSocialNetworksDto) {
		const sn = this.linkedAccountRepository.create({
			user: userId,
			...dto
		})
		return await this.linkedAccountRepository.save(sn)
	}
}
