import { Controller,Get,Post,Body,Param,Patch,Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Post()
    create(@Body() body:any){
        return this.usersService.create(body);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string){
        return this.usersService.findOne(Number(id));
    }

    @Patch('id')
    update(@Param('id') id:string , @Body() body:any){
        return this.usersService.update(Number(id), body);
    }

    @Delete('id')
    remove(@Param('id') id:string){
        return this.usersService.remove(Number(id));
    }

}
