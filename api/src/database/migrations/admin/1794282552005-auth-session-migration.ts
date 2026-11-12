import { MigrationInterface, QueryRunner, Table } from "typeorm";

const tableName = 'admin.auth_sessions';

export class AuthSessionMigration1794282552005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isGenerated: true,
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'refresh_hash',
                        type: 'varchar',
                        length: '60',
                        isNullable: false,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamptz',
                        isNullable: false,
                    },
                    {
                        name: 'revoked_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'last_used_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamptz',
                        default: 'now()',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable(tableName, true);
    }
}
