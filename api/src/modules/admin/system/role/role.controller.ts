import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { Controller, Get, Post, Body, Param, Delete, Query, ParseUUIDPipe, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { RoleResponseDto } from './dto/role-response.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { RoleSelectOptionResponseDto } from './dto/role-select-option-response.dto';

@ApiTags('Roles')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions('role-create')
  @ApiOperation({ summary: 'Create a role' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiConflictResponse({ description: 'Role already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.roleService.create(dto);
  }

  @Get()
  @Permissions('role-read')
  @ApiOperation({ summary: 'Find all roles' })
  @ApiPaginationResponseDto(RoleResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<RoleResponseDto>> {
    return this.roleService.list(dto);
  }

  @Get('select-options')
  @Permissions('role-read')
  @ApiOperation({ summary: 'Find all roles for select options' })
  @ApiOkResponse({ type: [RoleSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(): Promise<RoleSelectOptionResponseDto[]> {
    return this.roleService.findAllForSelectOptions();
  }

  @Get(':id')
  @Permissions('role-read')
  @ApiOperation({ summary: 'Find a role by id' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @Permissions('role-update')
  @ApiOperation({ summary: 'Find a role by id' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleRequestDto): Promise<RoleResponseDto> {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('role-delete')
  @ApiOperation({ summary: 'Find a role by id' })
  @ApiOkResponse({ description: 'Role deleted successfully' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}
