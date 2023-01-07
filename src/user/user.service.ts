import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { ActivationLinkEntity } from '../mail/activation-link.entity'
import * as dayjs from 'dayjs'
import { ProfileEntity } from '../profile/entities/profile.entity'
import { I18nContext } from 'nestjs-i18n'
import { ConfigService } from '@nestjs/config'
import { ActivateDto } from './dto'
import { ProfileSocialNetworksEntity } from '../profile/entities/profile-social-networks.entity'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(ActivationLinkEntity)
		private readonly alRepository: Repository<ActivationLinkEntity>,
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		@InjectRepository(ProfileSocialNetworksEntity)
		private readonly profileSocialNetworksRepository: Repository<ProfileSocialNetworksEntity>,
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	async activateUser(dto: ActivateDto, i18n: I18nContext) {
		const user = await this.userRepository.findOneBy({ id: dto.uid })
		const aLink = await this.alRepository.findOneBy({ userId: dto.uid })

		if (!user) throw new BadRequestException(i18n.t('api-user.AccountDeleted'))
		if (!aLink || user.isVerified)
			throw new BadRequestException(i18n.t('api-user.AccountActivated'))
		if (aLink.hash !== dto.hash)
			throw new BadRequestException(i18n.t('api-user.IncorrectActivationLink'))

		const createdDate = dayjs(aLink.createdAt)
		if (createdDate.diff(dayjs(), 'day', false) >= 1)
			throw new BadRequestException(i18n.t('api-user.ActivationLinkOverdue'))

		await this.alRepository.remove(aLink)
		user.isVerified = true
		await this.userRepository.save(user)

		const profile = await this.profileRepository.save({
			user: user,
			egsId: dto.egsId,
			country: dto.country
		})
		profile.socialNetworks = await this.profileSocialNetworksRepository.save({
			profile: profile
		})
		await this.profileRepository.save(profile)
		return HttpStatus.OK
	}

	async getProfile(id: number) {
		return await this.userRepository.findOne({
			where: {
				id: id
			},
			relations: ['profile', 'profile.socialNetworks', 'subscriptions']
		})
	}

	@Cron('0 0 * * *')
	async cleanNonVerifiedUsers() {
		const now = dayjs()
		const users = await this.userRepository.findBy({
			isVerified: false
		})
		if (!users || users.length === 0) return
		const usersToDelete: number[] = []
		users.forEach(user => {
			const createdDate = dayjs(user.createdAt)
			if (createdDate.diff(now, 'day', false) >= 7) {
				usersToDelete.push(user.id)
			}
		})
		await this.userRepository.delete(usersToDelete)
	}
}
