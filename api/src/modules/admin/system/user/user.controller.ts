import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe, 
  Put 
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { 
  ApiBearerAuth, 
  ApiConflictResponse, 
  ApiForbiddenResponse, 
  ApiInternalServerErrorResponse, 
  ApiNotFoundResponse, 
  ApiOkResponse, 
  ApiOperation, 
  ApiTags, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { UserSelectOptionResponseDto } from './dto/user-select-option-response.dto';

@ApiTags('Users')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions('user-create')
  @ApiOperation({ summary: 'Create a user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiConflictResponse({ description: 'User already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  @Permissions('user-read')
  @ApiOperation({ summary: 'Find all users' })
  @ApiPaginationResponseDto(UserResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.userService.list(dto);
  }

  @Get('select-options')
  @Permissions('user-read')
  @ApiOperation({ summary: 'Find all users for select options' })
  @ApiOkResponse({ type: [UserSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(): Promise<UserSelectOptionResponseDto[]> {
    return this.userService.findAllForSelectOptions();
  }

  @Get(':id')
  @Permissions('user-read')
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Permissions('user-update')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('user-delete')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
