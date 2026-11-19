import { BaseEntity } from "@/database/entities/base.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";
import { WarehouseEntity } from "@/modules/admin/master-data/warehouse/entities/warehouse.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { 
    Column, 
    Entity, 
    Index, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";

export enum StockMovementTypeEnum {
    OPENING = 'OPENING',
    RECEIPT = 'RECEIPT',
    ISSUE = 'ISSUE',
    TRANSFER_IN = 'TRANSFER_IN',
    TRANSFER_OUT = 'TRANSFER_OUT',
    ADJUSTMENT = 'ADJUSTMENT',
};

@Entity({
    schema: 'admin',
    name: 'stock_movements',
})
@Index('IDX_stock_movements_product_warehouse_created_at', [
    'productId',
    'warehouseId',
    'createdAt',
])
@Index(
    'UQ_stock_movements_reference_type_id_movement_type',
    [
        'referenceType',
        'referenceId',
        'movementType',
    ],
    {
        unique: true,
    },
)
export class StockMovementEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'product_id',
        type: 'uuid',
        nullable: false,
    })
    productId: string;

    @ManyToOne(() => ProductEntity, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn({
        name: 'product_id',
    })
    product: ProductEntity;

    @Column({
        name: 'warehouse_id',
        type: 'uuid',
        nullable: false,
    })
    warehouseId: string;

    @ManyToOne(() => WarehouseEntity, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn({
        name: 'warehouse_id',
    })
    warehouse: WarehouseEntity;

    @Column({
        name: 'movement_type',
        type: 'enum',
        enum: StockMovementTypeEnum,
        nullable: false,
    })
    movementType: StockMovementTypeEnum;

    @Column({
        name: 'reference_type',
        type: 'varchar',
        length: '30',
        nullable: false,
    })
    referenceType: string;

    @Column({
        name: 'reference_id',
        type: 'uuid',
        nullable: false,
    })
    referenceId: string;

    @Column({
        name: 'quantity_change',
        type: 'decimal',
        precision: 14,
        scale: 5,
        nullable: false,
    })
    quantityChange: number;

    @Column({
        name: 'balance_after',
        type: 'decimal',
        precision: 14,
        scale: 5,
        nullable: false,
    })
    balanceAfter: number;

    @Column({
        name: 'created_by_id',
        type: 'uuid',
        nullable: false,
    })
    createdById: string;

    @ManyToOne(() => UserEntity, {
        nullable: true,
        cascade: true,
    })
    @JoinColumn({
        name: 'created_by_id',
    })
    createdBy: UserEntity;

    constructor(partial?: Partial<StockMovementEntity>) {
        super();
        Object.assign(this, partial);
    }
}
