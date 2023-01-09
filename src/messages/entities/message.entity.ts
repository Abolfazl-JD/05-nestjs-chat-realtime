import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from '../../auth/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    text: string

    @Column({ type : 'boolean', default: false })
    edited : boolean

    @ManyToOne(() => User, user => user.messages)
    user : User
}
