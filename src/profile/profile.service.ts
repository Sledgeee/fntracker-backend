import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProfileEntity } from './entities/profile.entity'
import { Repository } from 'typeorm'
import { UpdateProfileDto, UpdateSocialNetworksDto } from './dto'
import { ProfileSocialNetworksEntity } from './entities/profile-social-networks.entity'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		@InjectRepository(ProfileSocialNetworksEntity)
		private readonly profileSnRepository: Repository<ProfileSocialNetworksEntity>
	) {}

	async getProfile(egsId) {
		const profile = await this.profileRepository.findOneBy({ egsId: egsId })
		if (!profile) throw new NotFoundException('Profile not found')
		return profile
	}

	async updateProfile(userId, dto: UpdateProfileDto) {
		const profile = await this.profileRepository.findOneBy({ user: userId })
		if (!profile) throw new BadRequestException('Profile doest not exists')
		if (!dto) throw new BadRequestException('Empty object is passed')
		profile.country = dto.country
		profile.avatar = dto.avatar
		profile.fullName = dto.fullName
		return await this.profileRepository.save(profile)
	}

	async incrementViews(egsId) {
		const profile = await this.profileRepository.findOneBy({ egsId: egsId })
		if (!profile) {
			const newProfile = this.profileRepository.create({
				egsId: egsId,
				viewsCount: 1
			})
			return await this.profileRepository.save(newProfile)
		}
		profile.viewsCount += 1
		return await this.profileRepository.save(profile)
	}

	async updateProfileSocialNetworks(userId, dto: UpdateSocialNetworksDto) {
		const profile = await this.profileRepository.findOneBy({ user: userId })
		if (!profile) throw new BadRequestException('Profile not found')
		const sn = this.profileSnRepository.create({
			profile: profile,
			...dto
		})
		return await this.profileSnRepository.save(sn)
	}
}
