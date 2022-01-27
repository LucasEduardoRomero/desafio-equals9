import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './auth.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,
        private jwtService: JwtService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        console.log("email = ", email);
        console.log("Pass =", pass);
        const user: User | undefined = await this.userService.findByEmail(email);
        if (user && user.secret == pass) {
            const { secret, ...result } = user; 
            return result;
        } 
        return null;
    }

    async login(auth: AuthDto) {
        // check if user exists        
        const user: User | undefined = await this.userService.findByEmail(auth.email);
        if (user) {
            // gen hash and compare
            const hash = await bcrypt.hash(auth.password, user.salt);
            if (hash == user.secret) {
                // gen jwt
                const { secret, ...payload } = user;
                return {
                    access_token: this.jwtService.sign(payload),
                }
            }
            return "Senha Inválida!";
        } 

    }

    async getUserFromToken(token: string): Promise<User | undefined> { 
        const result = this.jwtService.decode(token.replace("Bearer ", ""));
        if (typeof(result) != "string") {
            return result._doc as User;
        }
        return undefined;
    }
}
