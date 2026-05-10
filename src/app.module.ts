import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [UsersModule,ProductsModule, AuthModule, CartModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports : [PrismaService],
})
export class AppModule {}
