import { BaseEntity } from "@/database/entities/base.entity";
import { WarehouseEntity } from "@/modules/admin/master-data/warehouse/entities/warehouse.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { 
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn
} from "typeorm";
import { StockReceiptItemEntity } from "./stock-receipt-item.entity";
import { AttachmentDto } from "@/common/dto/attachment.dto";

export enum StockStatusEnum {
    DRAFT = 'DRAFT',
    POSTED = 'POSTED',
    CANCELLED = 'CANCELLED',
};

@Entity({
    schema: 'admin',
    name: 'stock_receipts',
})
export class StockReceiptEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'document_number',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    documentNumber: string;

    @Column({
        name: 'warehouse_id',
        type: 'uuid',
        nullable: false,
    })
    warehouseId: string;

    @ManyToOne(() => WarehouseEntity, {
        cascade: true,
        nullable: true,
    })
    @JoinColumn({
        name: 'warehouse_id',
    })
    warehouse: WarehouseEntity;

    @Column({
        name: 'receipt_date',
        type: 'date',
        nullable: false,
    })
    receiptDate: Date;

    @Column({
        name: 'reference_no',
        type: 'varchar',
        length: '150',
        nullable: false,
    })
    referenceNo: string;

    @Column({
        name: 'description',
        type: 'varchar',
        length: '250',
        nullable: true,
    })
    description: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: StockStatusEnum,
        nullable: false,
    })
    status: StockStatusEnum;

    @Column({
        name: 'total_quantity',
        type: 'decimal',
        precision: 15,
        scale: 5,
        nullable: false,
    })
    totalQuantity: number;

    @Column({
        name: 'created_by_id',
        type: 'uuid',
        nullable: false,
    })
    createdById: string;

    @ManyToOne(() => UserEntity, {
        cascade: true,
        nullable: true,
    })    
    @JoinColumn({
        name: 'created_by_id',
    })
    createdBy: UserEntity;

    @Column({
        name: 'posted_by_id',
        type: 'uuid',
        default: null,
        nullable: true,
    })
    postedById: string;

    @ManyToOne(() => UserEntity, {
        cascade: true,
        nullable: true,
    })    
    @JoinColumn({
        name: 'posted_by_id',
    })
    postedBy: UserEntity;

    @Column({
        name: 'posted_at',
        type: 'timestamptz',
        default: null,
        nullable: true,
    })
    postedAt: Date;

    @Column({
        name: 'attachments',
        type: 'jsonb',
        nullable: true,
    })
    attachments: AttachmentDto[];

    @OneToMany(() => StockReceiptItemEntity, (item) => item.stockReceipt, { 
        cascade: [
            'insert', 
            'update',
        ] 
    })
    items: StockReceiptItemEntity[];

    constructor(partial?: Partial<StockReceiptEntity>) {
        super();
        Object.assign(this, partial);
    }
}
