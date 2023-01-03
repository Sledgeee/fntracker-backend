import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Base } from '../utils'
import { UserEntity } from '../user/user.entity'

@Entity('Profile')
export class ProfileEntity extends Base {
	@OneToOne(() => UserEntity, user => user.id)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@Column({ name: 'egs_id', unique: true, nullable: false })
	egsId: string

	@Column({ name: 'views_count' })
	viewsCount: number

	@Column({ nullable: false })
	country: string
}
