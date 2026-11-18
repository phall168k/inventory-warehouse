import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';
import { CurrentUser } from '@nestjs/authentication';
import { UserResponseDto } from '../../system/user/dto/user-response.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { ProductSelectOptionDto } from './dto/product-select-option-response.dto';

@ApiTags('Products')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/products',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Permissions('product-create')
  @ApiOperation({ summary: 'Create a product' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiConflictResponse({ description: 'Product already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: UserResponseDto,
  ): Promise<ProductResponseDto> {
    return this.productService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('product-read')
  @ApiOperation({ summary: 'Find all products' })
  @ApiPaginationResponseDto(ProductResponseDto)
  public findAll(
    @Query() dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<ProductResponseDto>> {
    return this.productService.list(dto);
  }

  @Get('select-options')
  @Permissions('product-read')
  @ApiOperation({ summary: 'Find all products for select options' })
  @ApiOkResponse({ type: [ProductSelectOptionDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(): Promise<ProductSelectOptionDto[]> {
    return this.productService.findAllForSelectOptions();
  }

  @Get(':id')
  @Permissions('product-read')
  @ApiOperation({ summary: 'Find a product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @Permissions('product-update')
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('product-delete')
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
