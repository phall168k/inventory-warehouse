import { BaseEntity } from "@/database/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "../../permission/entities/permission.entity";

@Entity({
    schema: 'admin',
    name: 'roles',
})
export class RoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'name_en',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    nameEn: string;

    @Column({
        name: 'name_kh',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    nameKh: string;

    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
        cascade: true,
        lazy: true,
    })
    @JoinTable({
        name: 'roles_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    })
    permissions: Promise<PermissionEntity[]>;

    constructor(partial?: Partial<PermissionEntity>) {
        super();
        Object.assign(this, partial);
    }
}
