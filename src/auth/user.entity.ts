import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Message } from "../messages/entities/message.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    username: string

    @Exclude()
    @Column()
    password: string

    @Column({ nullable: true })
    client_id: string

    @OneToMany(() => Message, message => message.user)
    messages : Message[]
}