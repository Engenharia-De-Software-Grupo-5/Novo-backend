import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserDto, UserResponse } from 'src/contracts/auth';
import { UserPasswordDto } from 'src/contracts/auth/user-password.dto';
import { UserService } from 'src/services/auth/user.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all users',
    description: 'Retrieve all users registered in the system.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all users',
    type: [UserResponse],
  })
  getAll(): Promise<UserResponse[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve details of a specific user identified by its ID.',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved user details',
    type: UserResponse,
  })
  getById(@Param('id') userId: string): Promise<UserResponse> {
    return this.userService.getById(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Register a new user in the system.',
  })
  @ApiBody({
    description: 'User data to be registered',
    type: UserDto,
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserResponse,
  })
  create(@Body() dto: UserDto): Promise<UserResponse> {
    return this.userService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing user',
    description: 'Update the data of an existing user identified by its ID.',
  })
  @ApiBody({
    description: 'Updated user data',
    type: UserDto,
  })
  @ApiOkResponse({
    description: 'User successfully updated',
    type: UserResponse,
  })
  update(@Param('id') id: string, @Body() dto: UserDto): Promise<UserResponse> {
    return this.userService.update(id, dto);
  }

  @Put(':id/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing user',
    description: 'Update the data of an existing user identified by its ID.',
  })
  @ApiBody({
    description: 'Updated user data',
    type: UserDto,
  })
  @ApiOkResponse({
    description: 'User password successfully updated',
    type: UserResponse,
  })
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UserPasswordDto,
  ): Promise<UserResponse> {
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Perform a soft delete of a user identified by its ID.',
  })
  @ApiOkResponse({
    description: 'User successfully deleted',
    type: UserResponse,
  })
  delete(@Param('id') userId: string): Promise<UserResponse> {
    return this.userService.delete(userId);
  }
}
