import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { Base } from '../../utils'
import { UserEntity } from '../../user/user.entity'
import { ProfileSocialNetworksEntity } from './profile-social-networks.entity'

@Entity('profile')
export class ProfileEntity extends Base {
	@OneToOne(() => UserEntity, user => user.id)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@Column({ name: 'egs_id', unique: true })
	egsId: string

	@Column()
	gradient: string

	@OneToOne(() => ProfileSocialNetworksEntity, psn => psn.id, {
		cascade: true
	})
	@JoinColumn({ name: 'social_networks' })
	socialNetworks: ProfileSocialNetworksEntity

	@Column({ nullable: false })
	country: string

	@Column({ default: '' })
	avatar: string

	@Column({ default: '' })
	fullName: string
}
