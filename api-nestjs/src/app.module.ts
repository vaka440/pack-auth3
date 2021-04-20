import { UserEntity } from './models/user.model';
import { RefreshTokenEntity } from './models/refresh-token.model';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './api/product.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [UserEntity, RefreshTokenEntity],
        keepConnectionAlive: true,
        synchronize: true,
      })
    }),
    UserModule,
    AuthModule,
  ],
  providers: [],
  controllers: [ProductController],         // plutôt que de mettre le controlleur ici, on aurait pu créer un module ProductModule et l'importer ici dans : imports: [...]
})
export class AppModule {}
