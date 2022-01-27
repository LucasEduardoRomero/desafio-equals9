import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() user: User): Promise<string> {
        
        this.userService.create(user);        
        return `Usuário ${user.email} criado com sucesso`;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Headers('Authorization') token: string, @Param('id') id: string, @Body() updatedUser: User): Promise<any> {
        return this.userService.update(token, id, updatedUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() : Promise<User[]> {
        return this.userService.findAll();        
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Headers('Authorization') token: string, @Param('id') id: string): Promise<User> {
        return this.userService.delete(token, id);        
    }    

    @UseGuards(JwtAuthGuard)
    @Get('pagination')
    async findAllPaginate(@Query('pageSize') pageSize: number, @Query('pageNumber') pageNumber: number) {
        return await this.userService.findAllPaginate(pageSize, pageNumber);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Headers('Authorization') token: string, @Param('id') id: string): Promise<User> {
        return this.userService.findById(token, id);        
    }

}
