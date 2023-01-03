import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class PrService {
	constructor(
		@Inject(ConfigService) private readonly configService: ConfigService
	) {}

	async getPr(platform, region, egsName) {
		const response = await axios.get(
			encodeURI(
				`${this.configService.get(
					'TRN_API_URL'
				)}/${platform}/${region}/${egsName}`
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
