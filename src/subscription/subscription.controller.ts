import { Controller, Delete, Param, Post } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { GetUserId } from '../common/decorators'

@Controller('subscription')
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Post('add/:shopItemId')
	getProductsByCategory(@GetUserId() userId, @Param() params) {
		return this.subscriptionService.subscribe(userId, params.shopItemId)
	}

	@Delete('remove/:shopItemId')
	searchProducts(@GetUserId() userId, @Param() params) {
		return this.subscriptionService.unsubscribe(userId, params.shopItemId)
	}
}
