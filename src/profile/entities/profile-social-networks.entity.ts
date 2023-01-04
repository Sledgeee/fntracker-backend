import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { ProfileEntity } from './profile.entity'
import { Base } from '../../utils'

@Entity('profile_social_networks')
export class ProfileSocialNetworksEntity extends Base {
	@OneToOne(() => ProfileEntity, profile => profile.id)
	@JoinColumn({ name: 'user_id' })
	profile: ProfileEntity

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
