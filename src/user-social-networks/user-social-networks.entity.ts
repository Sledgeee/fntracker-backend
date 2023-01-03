import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Base } from '../utils'
import { UserEntity } from '../user/user.entity'

@Entity('user_social_networks')
export class UserSocialNetworksEntity extends Base {
	@OneToOne(() => UserEntity, user => user.id)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@Column()
	youtube: string

	@Column()
	twitch: string

	@Column()
	twitter: string

	@Column()
	instagram: string

	@Column()
	telegram: string
}
