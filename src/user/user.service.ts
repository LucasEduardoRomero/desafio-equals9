import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.interface';
import { UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';


@Injectable()
export class UserService {
    

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
       ) { }

    async create(user: User): Promise<UserDocument> {
        // verify if email already exists
        const users: User[] = await this.userModel.find({ email: user.email });
        if(users.length > 0) {
            throw new Error("O E-mail já está cadastrado!");
        }
        user.salt = await bcrypt.genSalt();
        const hash: string = await bcrypt.hash(user.secret, user.salt);
        user.secret = hash;
        const createdUser = new this.userModel(user);
        return createdUser.save();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    async delete(token: string, id: string): Promise<any> {
        const tokenUser = await this.authService.getUserFromToken(token);
        const user = await this.userModel.findById(id).exec();
        
        if (tokenUser && tokenUser.email == user.email) {
            const userDeleted = this.userModel.findOneAndDelete({_id: id}).exec();
            return (await userDeleted).remove();
        }
        return { message: "Você não tem permissão para excluir outro usuário!" };
    }

    async update(token: string, id: string, updatedUser: User): Promise<any> {
        // verify if user is updating himself
        const tokenUser = await this.authService.getUserFromToken(token);
        const user = await this.userModel.findById(id).exec();
        
        if (tokenUser && tokenUser.email == user.email) {
            if (updatedUser.email != user.email) {
                // is changin email. Check if new email already exists
                const possibleEmailUser = await this.userModel.findOne({email: updatedUser.email}).exec();
                if (possibleEmailUser) {
                    return { message: "Este E-mail já está cadastrado!" };
                }
            }
            return this.userModel.findByIdAndUpdate(id, updatedUser).exec();     
        }
        return { message: "Você não tem permissão para atualizar outro usuário!" };
    }

    async findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email}).exec();
    }

    async findById(token: string, id: string): Promise<any> {
        const tokenUser = await this.authService.getUserFromToken(token);
        const user = await this.userModel.findById(id).exec();
        
        if (tokenUser && tokenUser.email == user.email) {
            return this.userModel.findById(id).exec();
        }
        return { message: "Você não tem permissão para visualizar outro usuário!" };
    }

    async findAllPaginate(pageSize = 1, pageNumber = 0) {
        return this.userModel.find()
            .skip(pageSize * pageNumber).limit(pageSize);
    }
}
