import { AttachmentDto } from "@/common/dto/attachment.dto";
import { BaseEntity } from "@/database/entities/base.entity";
import { UserEntity } from "@/modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    schema: 'admin',
    name: 'warehouses',
})
export class WarehouseEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'code',
        type: 'varchar',
        length: '100',
        unique: true,
        nullable: false,
    })
    code: string;

    @Column({
        name: 'name_en',
        type: 'varchar',
        length: '250',
        unique: true,
        nullable: false,
    })
    nameEn: string;

    @Column({
        name: 'name_kh',
        type: 'varchar',
        length: '250',
        unique: true,
        nullable: false,
    })
    nameKh: string;

    @Column({
        name: 'manager_id',
        type: 'uuid',
        nullable: true,
    })
    managerId: string;

    @ManyToOne(() => UserEntity, { 
        nullable: true, 
        cascade: true 
    })
    @JoinColumn(({
        name: 'manager_id'
    }))
    manager: UserEntity;

    @Column({
        name: 'address',
        type: 'varchar',
        length: '250',
        nullable: true,
    })
    address: string;

    @Column({
        name: 'contact_number',
        type: 'varchar',
        length: '150',
        nullable: true,
    })
    contactNumber: string;

    @Column({
        name: 'logo',
        type: 'jsonb',
        nullable: true,
    })
    logo: AttachmentDto;

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

    @ManyToMany(() => UserEntity, (user) => user.warehouses)
    users: Promise<UserEntity[]>;

    constructor(partial?: Partial<WarehouseEntity>) {
        super();
        Object.assign(this, partial);
    }
}
