import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getTypeOrmConfig = async (
	configService: ConfigService
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: configService.get<string>('DB_HOST'),
	port: configService.get<number>('DB_PORT'),
	database: configService.get<string>('DB_NAME'),
	username: configService.get<string>('DB_USER'),
	password: configService.get<string>('DB_PASS'),
	autoLoadEntities: true,
	synchronize: true
})
