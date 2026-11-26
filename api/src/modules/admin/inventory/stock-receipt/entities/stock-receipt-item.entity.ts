import { BaseEntity } from "@/database/entities/base.entity";
import { 
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { StockReceiptEntity } from "./stock-receipt.entity";
import { ProductEntity } from "@/modules/admin/master-data/product/entities/product.entity";

@Entity({
    schema: 'admin',
    name: 'stock_receipt_items',
})
export class StockReceiptItemEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'stock_receipt_id',
        type: 'uuid',
        nullable: false,
    })
    stockReceiptId: string;

    @ManyToOne(() => StockReceiptEntity, (stockReceipt) => stockReceipt.items, {
        cascade: true,
    })
    @JoinColumn({
        name: 'stock_receipt_id'
    })
    stockReceipt: StockReceiptEntity;

    @Column({
        name: 'product_id',
        type: 'uuid',
        nullable: false,
    })
    productId: string;

    @ManyToOne(() => ProductEntity, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn({
        name: 'product_id',
    })
    product: ProductEntity;

    @Column({
        name: 'quantity',
        type: 'decimal',
        precision: 15,
        scale: 5,
        nullable: false,
    })
    quantity: number;

    @Column({
        name: 'unit_cost',
        type: 'decimal',
        precision: 15,
        scale: 5,
        nullable: false,
    })
    unitCost: number;

    @Column({
        name: 'note',
        type: 'varchar',
        length: '250',
        nullable: true,
    })
    note: string;

    constructor(partial?: Partial<StockReceiptItemEntity>) {
        super();
        Object.assign(this, partial);
    }
}
