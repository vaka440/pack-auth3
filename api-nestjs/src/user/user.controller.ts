import { RolesGuard } from './../guards/roles.guard';
import { UserService } from './user.service';
import { BadRequestException,  Body,  Controller,  Delete,  Get,  Param,  ParseIntPipe,  Post,  UseGuards } from '@nestjs/common';
import { RequestWithUser, UserDto } from './user.dto';
import { User } from './user.decorator';
import { Role } from '../models/user.model';
import { Roles } from '../auth/roles.decorator';
import { ApiBadRequestResponse,  ApiBearerAuth,  ApiCreatedResponse,  ApiOkResponse,  ApiTags,  ApiUnauthorizedResponse, ApiResponse } from '@nestjs/swagger';
import { JWTGuard } from '../guards/jwt.guard'

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

@ApiTags('user')
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService,
  ) {}

  @Get('me')  
  @UseGuards(JWTGuard)  
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })  
  getMe(@User() user: RequestWithUser) {
    return user;
  }

  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(JWTGuard, RolesGuard)
  @ApiOkResponse({ description: 'All users have been returned', })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. User is not an admin', })
  async getAll() {
    return (await this.userService.findAll()).map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }));
  }

  @Post('create')
  @Roles(Role.Admin)
  @UseGuards(JWTGuard, RolesGuard)
  @ApiCreatedResponse({ description: 'User has been created', })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. User is not an admin', })
  async create(@Body() user: UserDto) {
    const { id, role, email } = await this.userService.create({
      ...user,
    });

    return { id, role, email };
  }

  @Delete('delete')
  @Roles(Role.Admin)
  @UseGuards(JWTGuard, RolesGuard)
  @ApiOkResponse({ description: 'User has been deleted', })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. User is not an admin', })
  async delete(@Param('id') id: string, @User('id') userId: string) {
    if (userId === id) {
      throw new BadRequestException({
        message: 'You cannot delete admin account',
      });
    }
    await this.userService.removeUser(id);

    return { success: true };
  }

  @Get('id/:id')
  @Roles(Role.Admin)
  @UseGuards(JWTGuard, RolesGuard)
  @ApiOkResponse({ description: 'User has been returned', })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. User is not an admin', })
  async getByID(@Param('id') id: string) {
    const { id: userID, role, email } = await this.userService.findByID(id);

    return { id: userID, role, email };
  }

  @Get('all/:skip')
  @Roles(Role.Admin)
  @UseGuards(JWTGuard, RolesGuard)
  @ApiOkResponse({ description: 'Users has been returned', })
  @ApiUnauthorizedResponse({ description: 'Unauthorized. User is not an admin', })
  async getPaginated(@Param('skip', ParseIntPipe) skip: number) {
    return (await this.userService.getPaginatedUsers(skip)).map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }));
  }

}
