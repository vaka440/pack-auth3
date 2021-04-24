import { IsNotEmpty, MinLength, IsEmail } from 'class-validator'

export class LoginRequest {
  @IsNotEmpty({ message: 'A email is required' })
  @MinLength(4, { message: 'Your email must be at least 6 characters' })  
  @IsEmail({}, { message: 'Your email is invalid' })    
  readonly email: string

  @IsNotEmpty({ message: 'A password is required to login' })
  @MinLength(6, { message: 'Your password must be at least 6 characters' })    
  readonly password: string
}

export class RegisterRequest {
  @IsNotEmpty({ message: 'An email is required' })
  @MinLength(6, { message: 'Your email must be at least 6 characters' })    
  @IsEmail({}, { message: 'Your email is invalid' })    
  readonly email: string

  @IsNotEmpty({ message: 'A password is required' })
  @MinLength(6, { message: 'Your password must be at least 6 characters' })
  readonly password: string
}

export class RefreshRequest {
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refresh_token: string
}