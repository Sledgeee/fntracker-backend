import { Controller, Get, Query } from '@nestjs/common'
import { PrService } from './pr.service'
import { Public } from '../common/decorators'
import { GetPrDto } from './get-pr.dto'

@Public()
@Controller('pr')
export class PrController {
	constructor(private readonly prService: PrService) {}

	@Get()
	async getPr(@Query() dto: GetPrDto) {
		return await this.prService.getPr(dto)
	}
}
