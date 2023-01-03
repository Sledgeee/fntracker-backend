import { PrimaryColumn } from 'typeorm'
import { Dates } from './dates'

export abstract class BaseWithoutIncrement extends Dates {
	@PrimaryColumn()
	id: number
}
