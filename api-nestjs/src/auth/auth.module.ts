import { Module, Global } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensService } from './refresh-tokens.service';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.model';
import { RefreshTokenEntity } from '../models/refresh-token.model';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  providers: [AuthService, RefreshTokensService, TokensService, ],    
  exports: [],
  imports: [ 
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]), 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),     
    UserModule,  
  ],  
  controllers: [AuthController,],
})
export class AuthModule {}
