import { UnprocessableEntityException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignOptions, TokenExpiredError } from 'jsonwebtoken'

import { UserEntity } from '../models/user.model'
import { RefreshTokenEntity } from '../models/refresh-token.model'

import { UserService } from '../user/user.service'
import { RefreshTokensService } from '../auth/refresh-tokens.service'

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience:'https://my-app.com',
}

export interface RefreshTokenPayload {
  jti: number;
  sub: string
}

@Injectable()
export class TokensService {

  public constructor (
    private readonly tokens: RefreshTokensService,
    private readonly users: UserService,
    private readonly jwt: JwtService
  ) {
  }

  public async generateAccessToken (user: UserEntity): Promise<string> {
    const opts: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: process.env.EXPIRES_IN,
    }
    return this.jwt.signAsync({}, opts)
  }

  public async generateRefreshToken (user: UserEntity): Promise<string> {
    const token = await this.tokens.createRefreshToken(user)
    const ttl = 60 * 60 * 24 * 30;

    const opts: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn: ttl,
      subject: String(user.id),
      jwtid: String(token.id),
    }

    return this.jwt.signAsync({}, opts)
  }

  public async resolveRefreshToken (encoded: string): Promise<{ user: UserEntity, token: RefreshTokenEntity }> {
    const payload = await this.decodeRefreshToken(encoded)
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload)

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found')
    }

    if (token.is_revoked) {
      throw new UnprocessableEntityException('Refresh token revoked')
    }

    const user = await this.getUserFromRefreshTokenPayload(payload)

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return { user, token }
  }

  public async createAccessTokenFromRefreshToken (refresh: string): Promise<{ token: string, user: UserEntity }> {
    const { user } = await this.resolveRefreshToken(refresh)

    const token = await this.generateAccessToken(user)

    return { user, token }
  }
  
  private async decodeRefreshToken (token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwt.verifyAsync(token)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired')
      } else {
        throw new UnprocessableEntityException('Refresh token malformed') 
      }
    }
  }

  private async getUserFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<UserEntity> {
    const subId = payload.sub

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.users.findByID(subId)
  }

  private async getStoredTokenFromRefreshTokenPayload (payload: RefreshTokenPayload): Promise<RefreshTokenEntity | null> {
    const tokenId = payload.jti

    if (!tokenId) {
      throw new UnprocessableEntityException('Refresh token malformed')
    }

    return this.tokens.findTokenById(tokenId)
  }
}