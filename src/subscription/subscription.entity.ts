import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Base } from '../utils'
import { UserEntity } from '../user/user.entity'

@Entity('Subscription')
export class SubscriptionEntity extends Base {
	@ManyToOne(() => UserEntity, user => user.id)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@Column({ name: 'shop_item_id' })
	shopItemId: string
}
