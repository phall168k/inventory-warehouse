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
import { CreateStockReceiptRequestDto } from './dto/create-stock-receipt-request.dto';
import { UpdateStockReceiptRequestDto } from './dto/update-stock-receipt-request.dto';
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
import { StockReceiptResponseDto } from './dto/stock-receipt-response.dto';
import { CurrentUser } from '@nestjs/authentication';
import { UserResponseDto } from '../../system/user/dto/user-response.dto';
import { Permissions } from '@/modules/auth/decorators/permission.decorator';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { Can } from '@nestjs/authorization';
import { StockReceiptSelectOptionResponseDto } from './dto/stock-receipt-select-option-response.dto';
import { StockReceiptService } from './stock-receipt.service';
import { StockPostingRequestDto } from '../stock/dto/stock-posting-request.dto';

@ApiTags('Stock Receipts')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/inventory/stock-receipts',
  version: '1',
})
export class StockReceivingController {
  constructor(private readonly stockReceiptService: StockReceiptService) {}

  @Post()
  @Permissions('stock-receipt-create')
  @ApiOperation({ summary: 'Create a stock receipt' })
  @ApiOkResponse({ type: StockReceiptResponseDto })
  @ApiConflictResponse({ description: 'Stock rS alreaeceipt already created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() dto: CreateStockReceiptRequestDto, @CurrentUser() user: UserResponseDto): Promise<StockReceiptResponseDto> {
    return this.stockReceiptService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Post('stock-receipt-posting')
  @Permissions('stock-receipt-posting-cancel')
  @ApiOperation({ summary: 'Delete a stock receipt by id' })
  @ApiOkResponse({ description: 'Stock receipt deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public posting(@Body() dto: StockPostingRequestDto, @CurrentUser() user: UserResponseDto): Promise<void> {
    return this.stockReceiptService.posting({
      ...dto,
      postedById: user.id,
    });
  }

  @Get()
  @Permissions('stock-receipt-read')
  @ApiOperation({ summary: 'Find all stock receipts' })
  @ApiPaginationResponseDto(StockReceiptResponseDto)
  public findAll(
    @Query() dto: PaginationRequestDto,
  ): Promise<PaginationResponseDto<StockReceiptResponseDto>> {
    return this.stockReceiptService.list(dto);
  }

  @Get('select-options')
  @Can.Anyone()
  @ApiOperation({ summary: 'Find all stock receipts for select options' })
  @ApiOkResponse({ type: [StockReceiptSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOption(): Promise<StockReceiptSelectOptionResponseDto[]> {
    return this.stockReceiptService.findAllForSelectOption();
  }

  @Get(':id')
  @Permissions('stock-receipt-read')
  @ApiOperation({ summary: 'Find a stock receipt by id' })
  @ApiOkResponse({ type: StockReceiptResponseDto })
  @ApiNotFoundResponse({ description: 'Stock receipt not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StockReceiptResponseDto> {
    return this.stockReceiptService.findOne(id);
  }

  @Put(':id')
  @Permissions('stock-receipt-update')
  @ApiOperation({ summary: 'Update a stock receipt by id' })
  @ApiOkResponse({ type: StockReceiptResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStockReceiptRequestDto): Promise<StockReceiptResponseDto> {
    return this.stockReceiptService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('stock-receipt-delete')
  @ApiOperation({ summary: 'Delete a stock receipt by id' })
  @ApiOkResponse({ description: 'Stock receipt deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.stockReceiptService.remove(id);
  }
}
