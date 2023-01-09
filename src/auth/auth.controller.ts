import { Body, ClassSerializerInterceptor, Controller, Post, Session, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('signup')
    async registerUser(@Body() userInfo: CreateUserDto, @Session() session: Record<string, any>) {
        const newUser = await this.authService.registerUser(userInfo)
        session.userId = newUser.id
        return newUser
    }

    @Post('login')
    async signinUser(@Body() userInfo: LoginUserDto, @Session() session: Record<string, any>) {
        const checkedInUser = await this.authService.loginUser(userInfo)
        session.userId = checkedInUser.id
        return checkedInUser
    }

    @Post('logout')
    logout(@Session() session: Record<string, any>) {
        session.userId = null
    }
}
