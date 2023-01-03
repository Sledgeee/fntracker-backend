import { Module } from '@nestjs/common'
import { PrController } from './pr.controller'
import { PrService } from './pr.service'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ConfigModule],
	controllers: [PrController],
	providers: [PrService]
})
export class PrModule {}
