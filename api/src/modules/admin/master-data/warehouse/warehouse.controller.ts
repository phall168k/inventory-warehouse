import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  Put 
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseRequestDto } from './dto/create-warehouse-request.dto';
import { UpdateWarehouseRequestDto } from './dto/update-warehouse-request.dto';
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
import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { WarehouseSelectOptionResponseDto } from './dto/warehouse-select-option-response.dto';
import { CurrentUser } from '@nestjs/authentication';
import { UserResponseDto } from '../../system/user/dto/user-response.dto';
import { Can } from '@nestjs/authorization';

@ApiTags('Warehouses')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/warehouses',
  version: '1',
})
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @Permissions('warehouse-create')
  @ApiOperation({ summary: 'Create a warehouse' })
  @ApiOkResponse({ type: WarehouseResponseDto })
  @ApiConflictResponse({ description: 'Warehouse already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() createWarehouseDto: CreateWarehouseRequestDto): Promise<WarehouseResponseDto> {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @Permissions('warehouse-read')
  @ApiOperation({ summary: 'Find all warehouses' })
  @ApiPaginationResponseDto(WarehouseResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<WarehouseResponseDto>> {
    return this.warehouseService.list(dto);
  }

  @Get('select-options')
  @Can.Anyone()
  @ApiOperation({ summary: 'Find all warehouses for select options' })
  @ApiOkResponse({ type: [WarehouseSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(@CurrentUser() user: UserResponseDto): Promise<WarehouseSelectOptionResponseDto[]> {
    return this.warehouseService.findAllForSelectOptions(user);
  }

  @Get(':id')
  @Permissions('warehouse-read')
  @ApiOperation({ summary: 'Find a warehouse by id' })
  @ApiOkResponse({ type: WarehouseResponseDto })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<WarehouseResponseDto> {
    return this.warehouseService.findOne(id);
  }

  @Put(':id')
  @Permissions('warehouse-update')
  @ApiOperation({ summary: 'Update a warehouse by id' })
  @ApiOkResponse({ type: WarehouseResponseDto })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWarehouseRequestDto): Promise<WarehouseResponseDto> {
    return this.warehouseService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('warehouse-delete')
  @ApiOperation({ summary: 'Delete a warehouse by id' })
  @ApiOkResponse({ description: 'Warehouse deleted successfully' })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.warehouseService.remove(id);
  }
}
