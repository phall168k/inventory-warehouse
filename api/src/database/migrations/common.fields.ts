import { TableColumnOptions } from "typeorm";

export const commonFields: TableColumnOptions[] = [
    {
        name: 'created_at',
        type: 'timestamptz',
        isNullable: true,
        default: 'now()',
    },
    {
        name: 'updated_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
    },
    {
        name: 'deleted_at',
        type: 'timestamptz',
        isNullable: true,
        default: null,
    },
];