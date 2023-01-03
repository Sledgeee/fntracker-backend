import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { ActivationLinkEntity } from '../mail/activation-link.entity'
import * as dayjs from 'dayjs'
import { ProfileEntity } from '../profile/profile.entity'
import { I18nContext } from 'nestjs-i18n'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(ActivationLinkEntity)
		private readonly alRepository: Repository<ActivationLinkEntity>,
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>,
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	async activateUser(
		userId: number,
		activationUid: string,
		egsId: string,
		country: string,
		i18n: I18nContext,
		res: Response
	) {
		const user = await this.userRepository.findOneBy({ id: userId })
		const aLink = await this.alRepository.findOneBy({ userId: userId })

		if (!user) throw new BadRequestException(i18n.t('api-user.AccountDeleted'))
		if (!aLink) throw new BadRequestException('api-user.AccountActivated')
		if (aLink.uid !== activationUid)
			throw new BadRequestException(i18n.t('api-user.IncorrectActivationLink'))

		const createdDate = dayjs(aLink.createdAt)
		if (createdDate.diff(dayjs(), 'day', false) >= 1)
			throw new BadRequestException(i18n.t('api-user.ActivationLinkOverdue'))

		await this.alRepository.remove(aLink)
		user.isVerified = true
		await this.userRepository.save(user)

		const profile = this.profileRepository.create({
			user: user,
			egsId: egsId,
			viewsCount: 0,
			country: country
		})
		await this.profileRepository.save(profile)
		return res.redirect(
			`${this.configService.get('CLIENT_URL')}/user/activation?status=200`
		)
	}

	async getProfile(id: number): Promise<UserEntity> {
		return await this.userRepository.findOne({
			where: {
				id: id
			},
			relations: ['profile', 'subscriptions']
		})
	}
}
