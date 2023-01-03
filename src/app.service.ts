import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class AppService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService
	) {}

	@Cron('1 0 * * *')
	async notifyUsers() {}

	@Cron('0 0 * * *')
	async cleanNonVerifiedUsers() {}
}
