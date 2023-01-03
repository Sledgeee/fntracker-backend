import { Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { GetUserId } from '../common/decorators'

@Controller('subscription')
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Get('all')
	async getUserSubscriptions(@GetUserId() userId) {
		return this.subscriptionService.getSubscriptions(userId)
	}

	@Post('add/:shopItemId')
	async getProductsByCategory(@GetUserId() userId, @Param() params) {
		return this.subscriptionService.subscribe(userId, params.shopItemId)
	}

	@Delete('remove/:shopItemId')
	async searchProducts(@GetUserId() userId, @Param() params) {
		return this.subscriptionService.unsubscribe(userId, params.shopItemId)
	}
}
