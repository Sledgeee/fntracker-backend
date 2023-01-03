import { Controller, Get, Query } from '@nestjs/common'
import { PrService } from './pr.service'
import { Public } from '../common/decorators'

@Controller('pr')
export class PrController {
	constructor(private readonly prService: PrService) {}

	@Public()
	@Get()
	async getPr(@Query() query) {
		return await this.prService.getPr(
			query['platform'],
			query['region'],
			query['egsName']
		)
	}
}
