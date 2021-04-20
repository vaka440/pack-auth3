import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.model';
import { RefreshTokenEntity } from '../models/refresh-token.model';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../guards/jwt-strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ]), 
    ConfigModule.forRoot(),
    PassportModule.register({      
      defaultStrategy: 'jwt',      
      property: 'user',      
      session: false,    
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),    
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, ],
  exports: [UserService, ],  
})
export class UserModule {}
