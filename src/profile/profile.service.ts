import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProfileEntity } from './entities/profile.entity'
import { Repository } from 'typeorm'
import { UpdateProfileDto, UpdateSocialNetworksDto } from './dto'
import { ProfileSocialNetworksEntity } from './entities/profile-social-networks.entity'
import { ProfileViewsEntity } from './entities/profile-views.entity'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		@InjectRepository(ProfileSocialNetworksEntity)
		private readonly profileSnRepository: Repository<ProfileSocialNetworksEntity>,
		@InjectRepository(ProfileViewsEntity)
		private readonly profileViewsRepository: Repository<ProfileViewsEntity>
	) {}

	async getProfile(egsId) {
		const profile = await this.profileRepository.findOne({
			where: {
				egsId: egsId
			},
			relations: ['socialNetworks']
		})
		let profileViews = await this.profileViewsRepository.findOneBy({
			egsId: egsId
		})
		if (!profileViews) {
			profileViews = await this.profileViewsRepository.save({
				egsId: egsId,
				count: 0
			})
		}
		return {
			profile: profile,
			viewsCount: profileViews.count
		}
	}

	async updateProfile(userId, dto: UpdateProfileDto) {
		if (!dto) throw new BadRequestException('Empty object is passed')
		return await this.profileRepository.update(
			{
				user: {
					id: userId
				}
			},
			{
				...dto
			}
		)
	}

	async incrementViews(egsId) {
		const pv = await this.profileViewsRepository.findOneBy({
			egsId: egsId
		})
		pv.count += 1
		return await this.profileViewsRepository.save(pv)
	}

	async updateProfileSocialNetworks(userId, dto: UpdateSocialNetworksDto) {
		const profile = await this.profileRepository.findOneBy({
			user: {
				id: userId
			}
		})
		if (!profile) throw new BadRequestException('Profile not found')
		return await this.profileSnRepository.update(
			{
				profile: profile
			},
			{
				...dto
			}
		)
	}
}
