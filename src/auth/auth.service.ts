import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { genSalt, hash, compare } from 'bcrypt'
import { UsersService } from './users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {

    constructor(@Inject('users_service') private usersService: UsersService){}

    async registerUser(userInfo: CreateUserDto) {
        userInfo.password = await this.encryptPassword(userInfo.password)
        return this.usersService.createUser(userInfo)
    }

    async loginUser(userInfo: LoginUserDto) {
        const { email, password } = userInfo
        // check if the user with this email exist
        const user = await this.usersService.findUserByEmail(email)
        if (!user) throw new UnauthorizedException('There is no account with this email')
        // check if the password is correct
        await this.checkPassword(password, user.password)

        return user
    }
    
    async encryptPassword(password: string) {
        const salt = await genSalt(10)
        return hash(password, salt)
    }

    async checkPassword(passToCheck: string, encryptedPass: string) {
        const isPasswordCorrect = await compare(passToCheck, encryptedPass)
        if(!isPasswordCorrect) throw new UnauthorizedException('password incorrect')
    }
}
