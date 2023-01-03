import { Injectable } from '@nestjs/common'
import { v4 } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { ActivationLinkEntity } from './activation-link.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MailHelperService {
	constructor(
		@InjectRepository(ActivationLinkEntity)
		private readonly activationLinkRepository: Repository<ActivationLinkEntity>
	) {}

	async createActivationLink(userId, egsId, country, isResend) {
		let link
		if (!isResend) {
			await this.activationLinkRepository.delete({ userId: userId })
			link = this.activationLinkRepository.create({
				userId: userId,
				uid: v4(),
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
				uid: v4()
			}
		)
		link = await this.activationLinkRepository.findOneBy({ userId: userId })
		return `${link.uid}&egsId=${link.egsId}&country=${link.country}`
	}
}
