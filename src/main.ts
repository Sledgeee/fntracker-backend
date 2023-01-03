import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import * as dayjs from 'dayjs'

require('dotenv').config({
	path: `${process.env.NODE_ENV}.env`
})

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		credentials: true,
		origin: process.env.CLIENT_URL
	})
	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(process.env.API_PORT, process.env.HOSTNAME, () =>
		console.log(`[${dayjs()}] Server started on port ${process.env.API_PORT}`)
	)
}

bootstrap()
