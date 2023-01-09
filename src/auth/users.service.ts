import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }
    
    createUser(userInfo: CreateUserDto) {
        const registeredUser = this.usersRepository.create(userInfo)
        return this.saveUser(registeredUser)
    }

    findUserByEmail(email: string) {
        return this.usersRepository.findOneBy({ email })
    }

    saveUser(user: User) {
        return this.usersRepository.save(user)
    }

    findOneByClientId(clientId: string) {
        return this.usersRepository.findOne({
            where: {
                client_id : clientId
            },
            relations: {
                messages : true
            }
        })
    }
}
