import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { JwtPayload } from '../types'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../../user/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_AT_SECRET')
		})
	}

	async validate(payload: JwtPayload) {
		return payload
	}
}
