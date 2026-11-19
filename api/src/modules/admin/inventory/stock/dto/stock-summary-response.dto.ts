import { ApiProperty } from '@nestjs/swagger';

export class StockSummaryResponseDto {
  @ApiProperty({ 
    description: 'Number of stock records' 
  })
  totalStocks: number;

  @ApiProperty({ 
    description: 'Number of distinct products with stock records' 
  })
  totalProducts: number;

  @ApiProperty({ 
    description: 'Number of distinct warehouses with stock records' 
  })
  totalWarehouses: number;

  @ApiProperty({ 
    description: 'Stock records with a positive balance at or below their minimum' 
  })
  lowStockCount: number;

  @ApiProperty({ 
    description: 'Stock records with a zero or negative balance' 
  })
  outOfStockCount: number;

  @ApiProperty({ 
    type: String, 
    description: 'Sum of balances, returned as a decimal string' 
  })
  totalStockQuantity: string;

  @ApiProperty({ 
    type: String, 
    description: 'Sum of received quantities, returned as a decimal string' 
  })
  totalReceiveQuantity: string;

  @ApiProperty({ 
    type: String, 
    description: 'Sum of issued quantities, returned as a decimal string' 
  })
  totalIssueQuantity: string;

  @ApiProperty({ 
    type: String, 
    description: 'Sum of transfer quantities, returned as a decimal string' 
  })
  totalTransferQuantity: string;

  @ApiProperty({ 
    type: String, 
    description: 'Sum of adjustment quantities, returned as a decimal string' 
  })
  totalAdjustmentQuantity: string;
}
