import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SubscriptionEntity } from './subscription.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SubscriptionService {
	constructor(
		@InjectRepository(SubscriptionEntity)
		private readonly subscriptionRepository: Repository<SubscriptionEntity>
	) {}

	async subscribe(userId, shopItemId: string) {
		const candidate = await this.subscriptionRepository.findOneBy({
			user: userId,
			shopItemId: shopItemId
		})
		if (candidate) throw new BadRequestException('')
		const subscription = await this.subscriptionRepository.create({
			shopItemId: shopItemId,
			user: userId
		})
		await this.subscriptionRepository.save(subscription)
	}

	async unsubscribe(user, shopItemId: string) {
		await this.subscriptionRepository.delete({
			user: user,
			shopItemId: shopItemId
		})
	}
}
