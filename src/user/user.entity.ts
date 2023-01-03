import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { Base } from '../utils'
import { SubscriptionEntity } from '../subscription/subscription.entity'
import { ProfileEntity } from '../profile/profile.entity'

@Entity('User')
export class UserEntity extends Base {
	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column({ default: false, name: 'is_verified' })
	isVerified: boolean

	@Column({ nullable: true, name: 'hashed_rt' })
	hashedRt?: string

	@OneToOne(() => ProfileEntity, profile => profile.user)
	profile: ProfileEntity

	@OneToMany(() => SubscriptionEntity, subscription => subscription.user)
	subscriptions: SubscriptionEntity[]
}
