import { BadRequestException, Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { ActivationLinkEntity } from './activation-link.entity'
import { Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { OtpEntity, OtpType } from '../otp/otp.entity'

@Injectable()
export class MailHelperService {
	constructor(
		@InjectRepository(ActivationLinkEntity)
		private readonly activationLinkRepository: Repository<ActivationLinkEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(OtpEntity)
		private readonly otpRepository: Repository<OtpEntity>
	) {}

	async createActivationLink(userId, egsId, country, isResend) {
		let link: ActivationLinkEntity
		if (!isResend) {
			await this.activationLinkRepository.delete({ userId: userId })
			link = this.activationLinkRepository.create({
				userId: userId,
				hash: v4(),
				egsId: egsId,
				country: country
			})
			await this.activationLinkRepository.save(link)
		}
		await this.activationLinkRepository.update(
			{
				userId: userId
			},
			{
				hash: v4()
			}
		)
		link = await this.activationLinkRepository.findOneBy({ userId: userId })
		return `user/activate?uid=${userId}&hash=${link.hash}&egsId=${link.egsId}&country=${link.country}`
	}

	async createRecoveryLink(email) {
		const user = await this.userRepository.findOneBy({ email: email })
		if (!user)
			throw new BadRequestException('User with specified email not found')
		let otp = await this.otpRepository.findOneBy({ userId: user.id })
		if (!otp) {
			otp = await this.otpRepository.create({
				userId: user.id,
				type: OtpType.RECOVERY
			})
		}
		otp.otp = v4()
		await this.otpRepository.save(otp)
		return `user/recovery?uid=${user.id}&otp=${otp.otp}&mail=${email}&recid=${otp.id}`
	}
}
