import { PrimaryGeneratedColumn } from 'typeorm'
import { Dates } from './dates'

export abstract class Base extends Dates {
	@PrimaryGeneratedColumn()
	id: number
}
