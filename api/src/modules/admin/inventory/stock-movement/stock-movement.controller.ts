import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  ParseUUIDPipe 
} from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { Permissions } from '@/modules/auth/decorators/permission.decorator';
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
import { ApiPaginationResponseDto } from '@/common/pagination/dto/api-pagination-response.decorator';
import { StockMovementResponseDto } from './dto/stock-movement-response.dto';
import { PaginationResponseDto } from '@/common/pagination/dto/pagination-response.dto';
import { PaginationRequestDto } from '@/common/pagination/dto/pagination-request.dto';
import { SWAGGER_TOKEN_NAME } from '@/swagger/config';

@ApiTags('Stock movements')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/inventory/stock-movements',
  version: '1',
})
export class StockMovementController {
  constructor(private readonly stockMovementService: StockMovementService) {}

  @Get()
  @Permissions('stock-movement-read')
  @ApiOperation({ summary: 'Find all stock movements' })
  @ApiPaginationResponseDto(StockMovementResponseDto)
  public findAll(@Query() dto: PaginationRequestDto): Promise<PaginationResponseDto<StockMovementResponseDto>> {
    return this.stockMovementService.list(dto);
  }

  @Get(':id')
  @Permissions('stock-movement-read')
  @ApiOperation({ summary: 'Find a stock movement by id' })
  @ApiOkResponse({ type: StockMovementResponseDto })
  @ApiNotFoundResponse({ description: 'Stock movement not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StockMovementResponseDto> {
    return this.stockMovementService.findOne(id);
  }
}
