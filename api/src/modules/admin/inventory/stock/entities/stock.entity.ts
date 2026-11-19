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

@Entity({
    schema: 'admin',
    name: 'stocks',
})
@Index(
    'UQ_stocks_product_warehouse',
    [
        'productId', 
        'warehouseId',
    ],
    { 
        unique: true, 
    }
)
export class StockEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'product_id',
        type: 'uuid',
        nullable: false,
    })
    productId: string;

    @ManyToOne(() => ProductEntity, {
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
        cascade: true,
    })
    @JoinColumn({
        name: 'warehouse_id',
    })
    warehouse: WarehouseEntity;

    @Column({
        name: 'min_stock',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
    })
    minStock: number;

    @Column({
        name: 'receive_quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
    })
    receiveQuantity: number;

     @Column({
        name: 'issue_quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
    })
    issueQuantity: number;

    @Column({
        name: 'transfer_quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
        default: 0,
    })
    transferQuantity: number;

    @Column({
        name: 'adjustment_quantity',
        type: 'decimal',
        precision: 14,
        scale: 5,
    })
    adjustmentQuantity: number;

    @Column({
        name: 'created_by_id',
        type: 'uuid',
        nullable: true,
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

    @Column({
        name: 'status',
        type: 'boolean',
        default: true,
    })
    status: boolean;
    
    constructor(partial?: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }

}
