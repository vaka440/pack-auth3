import { UserService } from '../user/user.service';
import { Body,  Controller, Post } from '@nestjs/common';
import { Role } from '../models/user.model';
import { ApiBadRequestResponse,  ApiCreatedResponse, ApiTags, } from '@nestjs/swagger';
import { TokensService } from '../auth/tokens.service';
import { UserEntity } from '../models/user.model'
import { RegisterRequest, LoginRequest, RefreshRequest } from '../auth/requests'

export interface AuthenticationPayload {
  user: {
    email: string
    role: Array<string>
  }
  payload: {
    type: string
    token: string
    refresh_token?: string
  }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    private userService: UserService,
    private tokensService: TokensService,
  ) {}

  @Post('login')
  @ApiCreatedResponse({ description: 'User has been logged in succesfully', })
  @ApiBadRequestResponse({ description: 'Error occured during login in', })
  async login(@Body() userLoginDto: LoginRequest) {
    const userCreated = await this.userService.logUser(userLoginDto) as UserEntity
    const token = await this.tokensService.generateAccessToken(userCreated)
    const refresh = await this.tokensService.generateRefreshToken(userCreated)
    const payload = this.buildResponsePayload(userCreated, token, refresh)

    return {
      status: 'success',
      data: payload,
    }    
  }

  @Post('register')
  @ApiCreatedResponse({ description: 'User has been registered succesfully', })
  @ApiBadRequestResponse({ description: 'Error occured during registering, user already exists etc.', })
  async register(@Body() userLoginDto: RegisterRequest) {
    const userCreated = await this.userService.create({
      ...userLoginDto,
      role: Role.User
    });

    const token = await this.tokensService.generateAccessToken(userCreated)
    const refresh = await this.tokensService.generateRefreshToken(userCreated)
    const payload = this.buildResponsePayload(userCreated, token, refresh)

    return {
      status: 'success',
      data: payload,
    }
  }

  @Post('/refresh')
  public async refresh (@Body() body: RefreshRequest) {
    console.log("body.refresh_token", body.refresh_token)
    const { user, token } = await this.tokensService.createAccessTokenFromRefreshToken(body.refresh_token)
    const payload = this.buildResponsePayload(user, token)

    return {
      status: 'success',
      data: payload,
    }
  }

  //  ====================================================================================================================================
  
  private buildResponsePayload (user: UserEntity, accessToken: string, refreshToken?: string): AuthenticationPayload {
    return {
      user: {
        email: user.email,
        role: [user.role]
      },
      payload: {
        type: 'bearer',
        token: accessToken,
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      } 
    } as AuthenticationPayload
  }  
}
