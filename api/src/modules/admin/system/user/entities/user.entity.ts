import { AttachmentDto } from "@/common/dto/attachment.dto";
import { BaseEntity } from "@/database/entities/base.entity";
import { 
    Column, 
    Entity, 
    JoinTable, 
    ManyToMany, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";
import { WarehouseEntity } from "@/modules/admin/master-data/warehouse/entities/warehouse.entity";

@Entity({
    schema: 'admin',
    name: 'users',
})
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name_en',
        type: 'varchar',
        length: '250',
        nullable: false,
    })
    nameEn: string;

    @Column({
        name: 'name_kh',
        type: 'varchar',
        length: '250',
        nullable: false,
    })
    nameKh: string;

    @Column({
        name: 'username',
        type: 'varchar',
        unique: true,
        length: '250',
        nullable: false,
    })
    username: string;

    @Column({
        name: 'email',
        type: 'varchar',
        unique: true,
        length: '250',
        nullable: false,
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: '255',
        select: false,
        nullable: false,
    })
    password: string;

    @Column({
        name: 'profile',
        type: 'jsonb',
        nullable: true,
    })
    profile: AttachmentDto;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isActive: boolean;

    @Column({
        name: 'is_super_user',
        type: 'boolean',
        default: null,
        nullable: true,
    })
    isSuperUser: boolean;

    @ManyToMany(() => RoleEntity, (role) => role.users, {
        cascade: false,
        lazy: true,
    })
    @JoinTable({
        name: 'users_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles: Promise<RoleEntity[]>;

    @ManyToMany(() => WarehouseEntity, (warehouse) => warehouse.users, {
        nullable: true,
        cascade: false,
        lazy: true,
    })
    @JoinTable({
        schema: 'admin',
        name: 'users_warehouses',
        joinColumn: {
            name: 'user_id',
        },
        inverseJoinColumn: {
            name: 'warehouse_id',
            referencedColumnName: 'id',
        }
    })
    warehouses: Promise<WarehouseEntity[]>;

    constructor(partial?: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }
}
