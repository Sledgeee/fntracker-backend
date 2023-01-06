import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OtpEntity } from './otp.entity'
import { Repository } from 'typeorm'
import { VerifyOtpDto } from './dto/verify-otp.dto'
import * as dayjs from 'dayjs'

@Injectable()
export class OtpService {
	constructor(
		@InjectRepository(OtpEntity)
		private readonly otpRepository: Repository<OtpEntity>
	) {}

	async verifyOtp(dto: VerifyOtpDto) {
		const otp = await this.otpRepository.findOneBy({
			id: dto.otpId,
			otp: dto.otp,
			userId: dto.userId
		})
		if (!otp) throw new BadRequestException('Otp not found')
		const createdDate = dayjs(otp.createdAt)
		if (createdDate.diff(dayjs(), 'minutes', false) >= 30)
			throw new BadRequestException('Otp overdue')
		return HttpStatus.OK
	}
}
