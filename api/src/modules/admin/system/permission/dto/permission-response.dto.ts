import { ApiProperty } from "@nestjs/swagger";

export class PermissionResponseDto {
    @ApiProperty({
        type: String,
        format: 'uuid',
        description: 'Unique permission identifier.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        type: String,
        maxLength: 160,
        description: 'Unique permission name.',
        example: 'inventory.read',
    })
    name: string;
}

export class PermissionSelectOptionResponseDto extends PermissionResponseDto {
    @ApiProperty({
        type: [PermissionResponseDto],
        description: 'Nested child permissions.',
    })
    children: PermissionResponseDto[];
}

