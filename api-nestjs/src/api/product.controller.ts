import { RolesGuard } from './../guards/roles.guard';
import { BadRequestException,  Body,  Controller,  Delete,  Get,  Param,  ParseIntPipe,  Post,  UseGuards } from '@nestjs/common';
import { Role } from '../models/user.model';
import { Roles } from '../auth/roles.decorator';
import { ApiBadRequestResponse,  ApiBearerAuth,  ApiCreatedResponse,  ApiOkResponse,  ApiTags,  ApiUnauthorizedResponse, ApiResponse } from '@nestjs/swagger';
import { JWTGuard } from '../guards/jwt.guard'

@ApiTags('api')
@Controller('api')
export class ProductController {

  constructor(
  ) {}

  @Get('products')  
  @UseGuards(JWTGuard)  
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })  
  getProducts() {
    return   JSON.stringify([
      { id: 1, name: "Product001", cost: 10, quantity: 1000 },
      { id: 2, name: "Product002", cost: 20, quantity: 2000 },
      { id: 3, name: "Product003", cost: 30, quantity: 3000 },
      { id: 4, name: "Product004", cost: 40, quantity: 4000 },
    ]);
  }

}
