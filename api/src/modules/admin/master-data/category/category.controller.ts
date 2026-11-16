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
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
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
import { CategoryResponseDto } from './dto/category-response.dto';
import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { CategorySelectOptionDto } from './dto/category-select-option-response.dto';
import { Can } from '@nestjs/authorization';

@ApiTags('Categories')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permissions('category-create')
  @ApiOperation({ summary: 'Create a category' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiConflictResponse({ description: 'Category already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() dto: CreateCategoryRequestDto, @CurrentUser() user: UserResponseDto): Promise<CategoryResponseDto> {
    return this.categoryService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('category-read')
  @ApiOperation({ summary: 'Find all categories' })
  @ApiPaginationResponseDto(CategoryResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<CategoryResponseDto>> {
    return this.categoryService.list(dto);
  }

  @Get('select-options')
  @Can.Anyone()
  @ApiOperation({ summary: 'Find all categories for select options' })
  @ApiOkResponse({ type: [CategorySelectOptionDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(): Promise<CategorySelectOptionDto[]> {
    return this.categoryService.findAllForSelectOptions();
  }
  
  @Get(':id')
  @Permissions('category-read')
  @ApiOperation({ summary: 'Find a category by id' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @Permissions('category-update')
  @ApiOperation({ summary: 'Update a category by id' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryRequestDto): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, dto);
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
    return this.categoryService.remove(id);
  }
}
