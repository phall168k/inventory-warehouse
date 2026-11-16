import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'categories',
})
export class CategoryEntity extends BaseEntity {
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
        name: 'created_by_id',
        type: 'uuid',
        nullable: true,
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
        name: 'status',
        type: 'boolean',
        default: true,
        nullable: false,
    })
    status: boolean;

    constructor(partial?: Partial<CategoryEntity>) {
        super();
        Object.assign(this, partial);
    }
}
