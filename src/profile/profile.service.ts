import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProfileEntity } from './profile.entity'
import { Repository } from 'typeorm'
import { UpdateProfileDto } from './update-profile.dto'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>
	) {}

	async getProfile(egsId) {
		const profile = await this.profileRepository.findOneBy({ egsId: egsId })
		if (!profile) throw new NotFoundException('Profile not found')
		return profile
	}

	async updateProfileImage(userId, dto: UpdateProfileDto) {
		const profile = await this.profileRepository.findOneBy({ user: userId })
		if (!profile) throw new BadRequestException('Profile doest not exists')
		if (!dto) throw new BadRequestException('Empty object passed')
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
}
