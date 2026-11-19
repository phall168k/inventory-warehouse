import { AttachmentDto } from '@/common/dto/attachment.dto';
import { BaseEntity } from '@/database/entities/base.entity';
import { UserEntity } from '@/modules/admin/system/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';
import { UomEntity } from '../../uom/entities/uom.entity';
import { StockEntity } from '@/modules/admin/inventory/stock/entities/stock.entity';

@Entity({ schema: 'admin', name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    length: '150',
    nullable: false,
  })
  code: string;

  @Column({
    name: 'name_en',
    type: 'varchar',
    unique: true,
    length: '250',
    nullable: false,
  })
  nameEn: string;

  @Column({
    name: 'name_kh',
    type: 'varchar',
    unique: true,
    length: '250',
    nullable: false,
  })
  nameKh: string;

  @Column({
    name: 'category_id',
    type: 'uuid',
    nullable: false,
  })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, {
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id',
  })
  category: CategoryEntity;

  @Column({
    name: 'uom_id',
    type: 'uuid',
    nullable: false,
  })
  uomId: string;

  @ManyToOne(() => UomEntity, {
    nullable: false,
  })
  @JoinColumn({
    name: 'uom_id',
  })
  uom: UomEntity;

  @Column({
    name: 'created_by_id',
    type: 'uuid',
    nullable: true,
  })
  createdById: string;

  @ManyToOne(() => UserEntity, {
    nullable: true,
  })
  @JoinColumn({
    name: 'created_by_id',
  })
  createdBy: UserEntity;

  @Column({
    name: 'status',
    type: 'boolean',
    default: true,
    nullable: false,
  })
  status: boolean;

  @Column({
    name: 'thumbnail',
    type: 'jsonb',
    nullable: true,
  })
  thumbnail: AttachmentDto;

  @OneToMany(() => StockEntity, (stock) => stock.product)
  stocks: StockEntity[];

  constructor(partial?: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
