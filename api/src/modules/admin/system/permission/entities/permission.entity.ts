import { BaseEntity } from "@/database/entities/base.entity";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";

@Entity({ 
    schema: 'admin', 
    name: 'permissions' 
})
export class PermissionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index('IDX_permissions_parent_id')
    @Column({
        name: 'parent_id',
        type: 'uuid',
        nullable: true,
    })
    parentId: string | null;

    @Column({ type: 'varchar', length: 160, unique: true })
    name: string;

    @ManyToOne(() => PermissionEntity, (permission) => permission.children, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({
        name: 'parent_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_permissions_parent_id',
    })
    parent: PermissionEntity | null;

    @OneToMany(() => PermissionEntity, (permission) => permission.parent)
    children: PermissionEntity[];

    @ManyToMany(() => RoleEntity, (role) => role.permissions)
    roles: RoleEntity[];
}
