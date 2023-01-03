import { Base } from '../utils'
import { Column, Entity } from 'typeorm'

@Entity('ActivationLink')
export class ActivationLinkEntity extends Base {
	@Column({ name: 'user_id' })
	userId: number

	@Column()
	uid: string

	@Column()
	egsId: string

	@Column()
	country: string
}
