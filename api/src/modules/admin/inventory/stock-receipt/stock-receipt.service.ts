import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockReceiptRequestDto } from './dto/create-stock-receipt-request.dto';
import { UpdateStockReceiptRequestDto } from './dto/update-stock-receipt-request.dto';
import { BasePaginationService } from '@/common/services/base-pagination.service';
import { StockReceiptEntity, StockStatusEnum } from './entities/stock-receipt.entity';
import { StockReceiptResponseDto } from './dto/stock-receipt-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { StockReceiptMapper } from './stock-receipt.mapper';
import { handleError } from '@/common/utils/handle-error.util';
import { StockReceiptSelectOptionResponseDto } from './dto/stock-receipt-select-option-response.dto';
import { StockReceiptItemEntity } from './entities/stock-receipt-item.entity';
import { StockMovementService } from '../stock-movement/stock-movement.service';
import { StockService } from '../stock/stock.service';
import { StockIncreaseRequestDto } from '../stock/dto/stock-increase-request.dto';
import { StockPostingRequestDto } from '../stock/dto/stock-posting-request.dto';

@Injectable()
export class StockReceiptService extends BasePaginationService<StockReceiptEntity, StockReceiptResponseDto> {
  protected SEARCHABLE_COLUMNS = [
    'documentNumber', 
    'createdBy.nameEn', 
    'createdBy.nameKh', 
    'warehouse.code', 
    'warehouse.nameEn', 
    'warehouse.nameKh',
    'postedBy.nameEn', 
    'postedBy.nameKh', 
    'description',
    'status',
    'referenceNo'
  ];
  protected RELATIONSHIP_FIELDS = [
    'createdBy', 
    'postedBy', 
    'warehouse',
  ];

  constructor(
    @InjectRepository(StockReceiptEntity)
    private readonly stockReceiptRepository: Repository<StockReceiptEntity>,
    @InjectRepository(StockReceiptItemEntity)
    private readonly stockReceiptItemRepository: Repository<StockReceiptItemEntity>,
    private readonly stockMovementService: StockMovementService,
    private readonly stockService: StockService,
  ) {
    super();
  }

  protected get repository(): Repository<StockReceiptEntity> {
    return this.stockReceiptRepository;
  }

  protected getMapperResponseEntityField(
    entity: StockReceiptEntity,
  ): Promise<StockReceiptResponseDto> {
    return StockReceiptMapper.toDto(entity);
  }
  
  public async create(dto: CreateStockReceiptRequestDto): Promise<StockReceiptResponseDto>  {
    try {
      let entity = StockReceiptMapper.toCreateEntity(dto);
      entity = await this.stockReceiptRepository.save(entity);
      return StockReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelectOption(): Promise<StockReceiptSelectOptionResponseDto[]> {
    try {
      const entities = await this.stockReceiptRepository.find();
      const itemsMapped = await Promise.all(
        entities.map((item) => StockReceiptMapper.toSelectOptionDto(item)),
      );
      return itemsMapped;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: string): Promise<StockReceiptResponseDto> {
    try {
      const entity = await this.stockReceiptRepository.findOne({
        where: { id },
        relations: {
          warehouse: true,
          createdBy: true,
          postedBy: true,
          items: {
            product: true,
          },
        },
      });
      if (!entity) throw new NotFoundException('Stock receipt not found');
      return StockReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(id: string, dto: UpdateStockReceiptRequestDto): Promise<StockReceiptResponseDto> {
    try {
      let entity = await this.stockReceiptRepository.findOne({
        where: { id },
        relations: {
          items: true,
        },
      });
      if (!entity) throw new NotFoundException('Stock receipt not found');
      const existingItemIds = entity.items.map((item) => item.id);
      const dtoItemIds = dto.items?.map((item) => item.id) ?? [];
      const itemsToRemove = existingItemIds.filter(
        (itemId) => !dtoItemIds.includes(itemId),
      );
      if (itemsToRemove.length > 0) {
        await this.stockReceiptItemRepository.softDelete(itemsToRemove);
      }
      entity = StockReceiptMapper.toUpdateEntity(entity, dto);
      entity = await this.stockReceiptRepository.save(entity);
      return StockReceiptMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const entity = await this.stockReceiptRepository.findOneBy({ id });
      if (!entity) throw new NotFoundException('Stock receipt not found');
      await this.stockReceiptRepository.softDelete(id);
    } catch (error) {
      handleError(error);
    }
  }

  public async posting(dto: StockPostingRequestDto): Promise<void> {
    try {
      const entity = await this.stockReceiptRepository.findOne({ 
        where: { 
          id: dto.id,
          status: Not(StockStatusEnum.CANCELLED),
        },
      });
      if (!entity) throw new NotFoundException('Stock receipt not found');
      await this.stockService.updateStockPostingStatus(
        this.stockReceiptRepository, 
        dto.id, 
        dto.status, 
        dto.postedById, 
        'receiveQuantity'
      );
    } catch (error) {
      handleError(error);
    }
  }
}
