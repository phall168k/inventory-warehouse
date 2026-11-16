import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { UomService } from './uom.service';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
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
import { CurrentUser } from '@nestjs/authentication';
import { UserResponseDto } from '../../system/user/dto/user-response.dto';
import { UomResponseDto } from './dto/uom-response.dto';
import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { UomSelectOptionDto } from './dto/uom-select-option-response.dto';
import { Can } from '@nestjs/authorization';

@ApiTags('Uoms')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/uoms',
  version: '1',
})
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  @Permissions('uom-create')
  @ApiOperation({ summary: 'Create a uom' })
  @ApiOkResponse({ type: UomResponseDto })
  @ApiConflictResponse({ description: 'Uom already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() dto: CreateUomRequestDto, @CurrentUser() user: UserResponseDto): Promise<UomResponseDto> {
    return this.uomService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('uom-read')
  @ApiOperation({ summary: 'Find all uoms' })
  @ApiPaginationResponseDto(UomResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<UomResponseDto>> {
    return this.uomService.list(dto);
  }

  @Get('select-options')
  @Can.Anyone()
  @ApiOperation({ summary: 'Find all uom for select options' })
  @ApiOkResponse({ type: [UomSelectOptionDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(): Promise<UomSelectOptionDto[]> {
    return this.uomService.findAllForSelectOptions();
  }
  
  @Get(':id')
  @Permissions('uom-read')
  @ApiOperation({ summary: 'Find a uom by id' })
  @ApiOkResponse({ type: UomResponseDto })
  @ApiNotFoundResponse({ description: 'Uom not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UomResponseDto> {
    return this.uomService.findOne(id);
  }

  @Put(':id')
  @Permissions('uom-update')
  @ApiOperation({ summary: 'Update a uom by id' })
  @ApiOkResponse({ type: UomResponseDto })
  @ApiNotFoundResponse({ description: 'Uom not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUomRequestDto): Promise<UomResponseDto> {
    return this.uomService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('uom-delete')
  @ApiOperation({ summary: 'Delete a uom by id' })
  @ApiOkResponse({ description: 'Uom deleted successfully' })
  @ApiNotFoundResponse({ description: 'Uom not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.uomService.remove(id);
  }
}
