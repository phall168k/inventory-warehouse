import { 
  Controller, 
  Get, 
  Body, 
  Put, 
  Param, 
  Delete, 
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { 
  ApiBearerAuth, 
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
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { StockResponseDto } from './dto/stock-response.dto';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { StockSelectOptionResponseDto } from './dto/stock-select-option-response.dto';
import { StockSelectOptionFilterReuestDto } from './dto/stock-select-option-filter-request.dto';
import { Can } from '@nestjs/authorization';
import { StockSummaryResponseDto } from './dto/stock-summary-response.dto';

@ApiTags('Stocks')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/inventory/stocks',
  version: '1',
})
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @Permissions('stock-read')
  @ApiOperation({ summary: 'Find all stock' })
  @ApiPaginationResponseDto(StockResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<StockResponseDto>> {
    return this.stockService.list(dto);
  }

  @Get('select-options')
  @Can.Anyone()
  @ApiOperation({ summary: 'Find all stock for select options' })
  @ApiOkResponse({ type: [StockSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findAllForSelectOptions(@Query() dto: StockSelectOptionFilterReuestDto): Promise<StockSelectOptionResponseDto[]> {
    return this.stockService.findAllForSelectOptions(dto);
  }

  @Get('summary')
  @Permissions('stock-read')
  @ApiOperation({ summary: 'Get stock summary' })
  @ApiOkResponse({ type: StockSummaryResponseDto })
  public summary(): Promise<StockSummaryResponseDto> {
    return this.stockService.summary();
  }

  @Get(':id')
  @Permissions('stock-read')
  @ApiOperation({ summary: 'Find a stock by id' })
  @ApiOkResponse({ type: StockResponseDto })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StockResponseDto> {
    return this.stockService.findOne(id);
  }

  @Put(':id')
  @Permissions('stock-update')
  @ApiOperation({ summary: 'Update a stock by id' })
  @ApiOkResponse({ type: StockResponseDto })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStockRequestDto): Promise<StockResponseDto> {
    return this.stockService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('stock-delete')
  @ApiOperation({ summary: 'Delete a stock by id' })
  @ApiOkResponse({ description: 'Stock deleted successfully' })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.stockService.remove(id);
  }
}
