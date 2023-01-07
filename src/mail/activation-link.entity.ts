import { Base } from '../utils'
import { Column, Entity } from 'typeorm'

@Entity('activation_link')
export class ActivationLinkEntity extends Base {
	@Column({ name: 'user_id' })
	userId: number

	@Column()
	hash: string

	@Column()
	egsId: string

	@Column()
	country: string
}
