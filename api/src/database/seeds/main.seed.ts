import { PermissionEntity } from "@/modules/admin/system/permission/entities/permission.entity";
import { DataSource, In } from "typeorm";
import { RoleEntity } from "@/modules/admin/system/role/entities/role.entity";
import { Seeder } from "typeorm-extension";
import { permissions } from "./permission.seed";
import { roles } from "./role.seed";
import { WarehouseEntity } from "@/modules/admin/master-data/warehouse/entities/warehouse.entity";
import { warehouses } from "./warehouse.seed";

export default class MainSeeder implements Seeder {
    public async run(database: DataSource): Promise<void> {
        // Permission seed
        const permissionRepository = database.getRepository(PermissionEntity);

        for (const permission of permissions) {
            let parent = await permissionRepository.findOne({
                where: {
                    name: permission.name,
                },
            });
            if (!parent) {
                parent = await permissionRepository.save(
                    permissionRepository.create({
                        name: permission.name,
                        parentId: null,
                    }),
                );
            }
            
            for(const childName of permission.children) {
                const existingChild = await permissionRepository.findOne({
                    where: {
                        name: childName,
                    },
                });
                if (!existingChild) {
                    await permissionRepository.save(
                        permissionRepository.create({
                            name: childName,
                            parentId: parent.id,
                        }),
                    );
                }
            }
        }

        // Role seed
        await database.transaction(async (manager) => {
            const roleRepository = manager.getRepository(RoleEntity);
            const permissionRepository = manager.getRepository(PermissionEntity);
    
            for (const role of roles) {
                const existingRole = await roleRepository.findOne({
                    where: { nameEn: role.nameEn },
                });
                if (existingRole) continue;
    
                const permissionNames = [...new Set(role.permissions)];
                const assignedPermissions = await permissionRepository.find({
                    where: { name: In(permissionNames) },
                });
                const foundNames = new Set(assignedPermissions.map((permission) => permission.name));
                const missingNames = permissionNames.filter((name) => !foundNames.has(name));
    
                if (missingNames.length > 0) {
                    throw new Error(
                        `Cannot seed role "${role.nameEn}": missing permissions: ${missingNames.join(', ')}`,
                    );
                }
    
                const entity = roleRepository.create({
                    nameEn: role.nameEn,
                    nameKh: role.nameKh,
                });
                entity.permissions = Promise.resolve(assignedPermissions);
                await roleRepository.save(entity);
            }
        });

        // Warehouse seed
        await database.manager.save(WarehouseEntity, warehouses);
        
    }
}