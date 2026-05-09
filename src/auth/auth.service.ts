import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ){}
    
    async signup(data: any){
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data: {
                namea: data.name,
                email: data.email,
                password: hashedPassword,
            }
        });

        return { id: user.id, email:user.email};
    }

    async login(data: any){
        const user = await this.prisma.user.findUnique({
            where: { email: data.email},
        });

        if(!user) return null;

        const isValid = await bcrypt.compare(
            data.password,
            user.password,
        )

        if(!isValid) return null;

        const token = this.jwt.sign({
            userId: user.id,
            email: user.email,
        });

        return { access_token: token};
    }
}
