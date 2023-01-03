import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { GetPrDto } from './get-pr.dto'

@Injectable()
export class PrService {
	constructor(
		@Inject(ConfigService) private readonly configService: ConfigService
	) {}

	async getPr(dto: GetPrDto) {
		const response = await axios.get(
			encodeURI(
				`${this.configService.get('TRN_API_URL')}/${dto.platform}/${
					dto.region
				}/${dto.egsName}`
			),
			{
				headers: {
					'TRN-Api-Key': this.configService.get('TRN_API_KEY')
				}
			}
		)
		return {
			status: response.status,
			data: response.data
		}
	}
}
