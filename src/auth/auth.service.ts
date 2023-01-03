import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '../user/user.entity'
import { IsNull, Not, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { AuthDto, RegisterDto } from './dto'
import * as bcrypt from 'bcrypt'
import { AuthResponse } from './types'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import { Buffer } from 'buffer'
import { verify } from 'jsonwebtoken'
import { Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { ProfileEntity } from '../profile/profile.entity'
import { MailSendgridService } from '../mail/mail-sendgrid.service'

@Injectable()
export class AuthService {
	constructor(
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@Inject(JwtService)
		private readonly jwtService: JwtService,
		@Inject(MailSendgridService)
		private readonly mailService: MailSendgridService,
		@InjectRepository(ProfileEntity)
		private readonly profileRepository: Repository<ProfileEntity>
	) {}

	async register(dto: RegisterDto, i18n: I18nContext): Promise<AuthResponse> {
		const candidate = await this.userRepository.findOneBy({ email: dto.email })

		if (candidate)
			throw new BadRequestException(i18n.t('api-auth.EmailAlreadyTaken'))

		const hashPass = await bcrypt.hash(dto.password, await bcrypt.genSalt(10))

		const newUser = this.userRepository.create({
			email: dto.email,
			password: hashPass
		})
		await this.userRepository.save(newUser)

		const tokens = await this.getTokens(newUser.id, newUser.email)
		newUser.hashedRt = await this.getHash(tokens.refreshToken)
		await this.userRepository.save(newUser)

		const egsIdCandidate = await this.profileRepository.findOneBy({
			egsId: dto.egsId
		})
		if (egsIdCandidate)
			throw new BadRequestException(i18n.t('api-auth.EgsIdAlreadyTaken'))

		this.mailService.sendActivationMail(
			newUser.id,
			newUser.email,
			dto.egsId,
			dto.country,
			i18n
		)
		return {
			userId: newUser.id,
			...tokens
		}
	}

	async login(dto: AuthDto, i18n: I18nContext): Promise<AuthResponse> {
		const user = await this.userRepository.findOne({
			where: {
				email: dto.email
			},
			select: ['id', 'email', 'password']
		})
		if (!user)
			throw new BadRequestException(i18n.t('api-auth.IncorrectEmailOrPassword'))

		const passwordMatches = await bcrypt.compare(dto.password, user.password)
		if (!passwordMatches)
			throw new ForbiddenException(i18n.t('api-auth.IncorrectEmailOrPassword'))

		const tokens = await this.getTokens(user.id, user.email)

		await this.updateRtHash(user.id, tokens.refreshToken)
		return {
			userId: user.id,
			...tokens
		}
	}

	async logout(userId: number) {
		await this.userRepository.update(
			{ id: userId, hashedRt: Not(IsNull()) },
			{
				hashedRt: null
			}
		)
	}

	async refresh(refreshToken: string, i18n: I18nContext) {
		let userData
		try {
			userData = verify(refreshToken, this.configService.get('JWT_RT_SECRET'))
		} catch (e) {
			throw new ForbiddenException()
		}
		const user = await this.userRepository.findOne({
			where: { id: Number(userData.sub) },
			select: ['id', 'email', 'hashedRt']
		})
		if (!user || !user.hashedRt)
			throw new ForbiddenException(i18n.t('api-auth.AccessDenied'))

		const rtMatches = await argon.verify(user.hashedRt, refreshToken)
		if (!rtMatches)
			throw new ForbiddenException(i18n.t('api-auth.AccessDenied'))

		const tokens = await this.getTokens(user.id, user.email)
		await this.updateRtHash(user.id, tokens.refreshToken)
		return tokens
	}

	async getHash(refreshToken: string) {
		return await argon.hash(refreshToken, {
			salt: Buffer.from(await bcrypt.genSalt(10), 'utf-8')
		})
	}

	async updateRtHash(userId: number, refreshToken: string) {
		await this.userRepository.update(
			{ id: userId },
			{ hashedRt: await this.getHash(refreshToken) }
		)
	}

	async getTokens(userId: number, email: string) {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email
				},
				{
					secret: this.configService.get('JWT_AT_SECRET'),
					expiresIn: this.configService.get('JWT_AT_EXP')
				}
			),
			this.jwtService.signAsync(
				{
					sub: userId
				},
				{
					secret: this.configService.get('JWT_RT_SECRET'),
					expiresIn: this.configService.get('JWT_RT_EXP')
				}
			)
		])

		return {
			accessToken: at,
			refreshToken: rt
		}
	}

	setCookie(response: Response, refreshToken: string) {
		response.cookie('fntracker-authorized', true, {
			maxAge: this.configService.get('JWT_RT_EXP_COOKIE')
		})
		response.cookie('fntracker-rt', refreshToken, {
			maxAge: this.configService.get('JWT_RT_EXP_COOKIE'),
			httpOnly: true
		})
	}

	clearCookie(response: Response) {
		response.cookie('fntracker-authorized', null, {
			maxAge: 0
		})
		response.cookie('fntracker-rt', null, {
			maxAge: 0,
			httpOnly: true
		})
	}
}
