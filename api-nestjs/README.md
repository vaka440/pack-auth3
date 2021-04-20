### Nestjs role user auth

Features:

1. Login with passing username and password. Username - unique, password - hashed.
2. CRUD for User Entity.
3. JWT Bearer Token Auth.
4. Role based auth - login - public route, me - only for logged users, and other routes for admin role.
5. Swagger OpenAPI



# Les requêtes

## Les différents décorateurs dans les controlleurs

### auth.controller.ts, user.controller.ts, product.controller.ts :

#### au niveau de la classe :

```
@ApiTags('user')
@Controller('user')
export class UserController {
    ...
```

#### au niveau des fonctions de la classe :

```
@Get('products')                    chemin url
@Get('id/:id')                      
@UseGuards(JWTGuard)                accès sécurisé sur un token valide
@Roles(Role.Admin)                  accès sécurisé sur un rôle précis
@UseGuards(JWTGuard, RolesGuard)    les 2

... fonction ...
```

créer son propre décorateur : @User()   (voir /user/user.decorator.ts)

```
...
  getMe(@User() user: RequestWithUser) {
    return user;
  }
...
```


## URLs

### /auth/auth.controller.ts

```
/auth/login         anonyme  
/auth/register      anonyme  
/auth/refresh       anonyme  
```

### /user/user.controller.ts

```
/user/me            jwt  
/user/all           jwt     Role.Admin  
/user/create        jwt     Role.Admin  
/user/delete        jwt     Role.Admin  
/user/id/:id        jwt     Role.Admin  
/user/all/:skip     jwt     Role.Admin  
```

### /api/product.controller.ts

```
api/products        jwt  
```

## Exemples d'accès aux urls

### login

```
POST http://localhost:3000/auth/login  
Content-Type	application/json  
Body raw json	{"email": "toto1@toto.fr", "password": "tototo"}  
```

### register

```
POST http://localhost:3000/auth/register  
Content-Type	application/json  
Body raw json	{"email": "toto1@toto.fr", "password": "tototo"}  
```

### refresh token

```
POST http://localhost:3000/auth/register  
Content-Type	application/json  
Body raw json	{ refresh_token: "...................................."}  
```

### obtenir la liste de tous les utilisateurs

- être authentifié (jeton)  
- avoir le rôle "admin"  

```  
GET http://localhost:3000/user/all  
Content-Type	application/json  
Authorization 	Bearer ......................  
```


# Validation

Il y a une validation de 1er niveau sur les données reçus  

- /validations/validation-filter.ts
- /validations/validation-exception.ts

main.ts

```ts
...
  app.useGlobalFilters(
    new ValidationFilter()    
  );
...
```
par exemple pour le login :

```
POST http://localhost:3000/auth/login  
Content-Type	application/json  
Body raw json	{"email": "toto1@toto.fr", "password": "tototo"}  
```

- si on met 2 caractères à password ```{"email": "toto1@toto.fr", "password": "to"}```  au lieu de 6 alors la validation bloque la requete et reponds une erreur (avec description de l'erreur) et ceci sans accèder à la base de donnée.  
- utilisation de la classe ```validation-filter.ts```  qui gère les validations  
- et les décorateurs comme : ```@IsNotEmpty``` ou ```@MinLength```  du fichier : ```requests.ts``` 
- remarque 1 :  le fichier ```requests.ts``` est en quelque sorte un DTO
- remarque 2 : le fichier : ```user.dto.ts``` ne possède pas de validation, on aurait pu en mettre. 

# Configuration

## jwt

.env

``` 
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxx
EXPIRES_IN=5m
``` 

- EXPIRES_IN ---------> le temps d'expiration du token  

## la base de donnée

renommer : ```ormconfig.json``` en ```ormconfig.json.back```
car on utilise le ```.env```

.env

``` 
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxx
EXPIRES_IN=5m

DB_PORT=5432
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=test
``` 

yarn add @nestjs/config  

app.module.ts

```ts
...
...
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,                          // DB_HOST=db    "db" est le nom du container Docker
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [UserEntity, RefreshTokenEntity],         // ici, ne pas oublier d'indiquer les entités que la base doit gérer
        keepConnectionAlive: true,
        synchronize: true,
      })
    }), 
    ...
    ...
```     

## swagger

main.ts

```ts
...
...
  SwaggerModule.setup('swagger-api', app, document);        // "swagger-api"  -> path, à modifier
...
```  

## CORS

main.ts

```ts
...
  app.enableCors({
    origin: ['http://localhost:5600'],
  });
...
```  

# swagger

accès à swagger fait avec cette grosse merde de React :

http://localhost:3000/swagger-api/

# les modules

exemple avec AuthModule:

```ts
@Global()
@Module({
  providers: [AuthService, RefreshTokensService, TokensService, ],    // on déclare ici les services qui seront gérer par l'injection de dépendance (DI)

  exports: [],                                                        // on peut exporter un controleur ou un module afin qu'il soit importable ailleurs 

  imports: [                                                          // on importe des packages avec éventuellement une configuration
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),       // on déclare ici les entités qui doivent être gérer par l'ORM

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),     

    UserModule,                                                     // ce module aura besoin du module : UserModule 
                                                                    // pour la connexion et l'enregistrement d'un utilisateur
  ],  
  controllers: [AuthController,],                                   // déclarer ici les controleurs qui doivent être prises en compte 
})
export class AuthModule {}
```


# remarques

tokens.service.ts

```ts
const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience:'https://my-app.com',
}
```

je n'ai pas compris à quoi sert : BASE_OPTIONS  

