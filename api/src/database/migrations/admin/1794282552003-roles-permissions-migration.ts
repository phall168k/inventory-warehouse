import { 
    MigrationInterface, 
    QueryRunner, 
    Table 
} from "typeorm";

const tableName = 'admin.roles_permissions';
const roleTable = 'admin.roles';
const permissionTable = 'admin.permissions';

export class RolesPermissionsMigration1794282552003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'role_id',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                    },
                    {
                        name: 'permission_id',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['role_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: roleTable,
                        onUpdate: 'CASCADE',
                    },
                    {
                        columnNames: ['permission_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: permissionTable,
                        onUpdate: 'CASCADE',
                    }
                ]
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable(tableName, true, true);
    }
}
