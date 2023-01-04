import { Column, Entity } from 'typeorm'
import { Base } from '../utils'

export enum OtpType {
	TWO_FACTOR,
	RECOVERY
}

@Entity('otp')
export class OtpEntity extends Base {
	@Column({ name: 'user_id' })
	userId: number

	@Column()
	otp: string

	@Column({
		type: 'enum',
		enum: OtpType,
		default: OtpType.RECOVERY
	})
	type: OtpType
}
