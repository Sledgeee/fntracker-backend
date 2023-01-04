import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Base } from '../../utils'
import { UserEntity } from '../../user/user.entity'
import { ProfileSocialNetworksEntity } from './profile-social-networks.entity'

@Entity('profile')
export class ProfileEntity extends Base {
	@OneToOne(() => UserEntity, user => user.id)
	@JoinColumn({ name: 'user_id' })
	user?: UserEntity

	@OneToOne(
		() => ProfileSocialNetworksEntity,
		socialNetworks => socialNetworks.profile
	)
	@JoinColumn({ name: 'social_networks' })
	socialNetworks: ProfileSocialNetworksEntity

	@Column({ name: 'egs_id', unique: true, nullable: false })
	egsId: string

	@Column({ name: 'views_count' })
	viewsCount: number

	@Column({ nullable: true })
	country: string

	@Column({ nullable: true })
	avatar: string

	@Column({ nullable: true })
	fullName: string
}
