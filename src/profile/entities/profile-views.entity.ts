import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('profile_views')
export class ProfileViewsEntity {
	@PrimaryColumn({ name: 'egs_id' })
	egsId: string
	@Column({ default: 0 })
	count: number
}
