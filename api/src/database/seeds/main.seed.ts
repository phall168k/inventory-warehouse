import { PermissionEntity } from "@/modules/admin/system/permission/entities/permission.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { permissions } from "./permission.seed";

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
    }
}