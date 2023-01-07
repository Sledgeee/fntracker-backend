import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { Base } from '../utils'
import { SubscriptionEntity } from '../subscription/subscription.entity'
import { ProfileEntity } from '../profile/entities/profile.entity'

@Entity('user')
export class UserEntity extends Base {
	@Column({ unique: true })
	email: string

	@Column({ select: false })
	password: string

	@Column({ default: false, name: 'is_verified' })
	isVerified: boolean

	@Column({ nullable: true, name: 'hashed_rt' })
	hashedRt?: string

	@OneToOne(() => ProfileEntity, profile => profile.user, {
		cascade: true
	})
	profile: ProfileEntity

	@OneToMany(() => SubscriptionEntity, subscription => subscription.user, {
		cascade: true
	})
	subscriptions: SubscriptionEntity[]
}
