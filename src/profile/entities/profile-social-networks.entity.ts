import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { ProfileEntity } from './profile.entity'
import { Base } from '../../utils'

@Entity('profile_social_networks')
export class ProfileSocialNetworksEntity extends Base {
	@OneToOne(() => ProfileEntity, profile => profile.id)
	@JoinColumn({ name: 'profile_id' })
	profile: ProfileEntity

	@Column({ default: '' })
	youtube: string

	@Column({ default: '' })
	twitch: string

	@Column({ default: '' })
	twitter: string

	@Column({ default: '' })
	instagram: string

	@Column({ default: '' })
	telegram: string
}
