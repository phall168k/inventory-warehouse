export const permissions = [
    {
        name: 'Role',
        children: [
            'role-read',
            'role-create',
            'role-update',
            'role-delete',
        ],
    },
    {
        name: 'User',
        children: [
            'user-read',
            'user-create',
            'user-update',
            'user-delete',
        ],
    },
    {
        name: 'Warehouse',
        children: [
            'warehouse-read',
            'warehouse-create',
            'warehouse-update',
            'warehouse-delete',
        ],
    },
    {
        name: 'Category',
        children: [
            'category-read',
            'category-create',
            'category-update',
            'category-delete',
        ],
    },
    {
        name: 'Uom',
        children: [
            'uom-read',
            'uom-create',
            'uom-update',
            'uom-delete',
        ],
    },
    { 
        name: 'Product', 
        children: [
            'product-read', 
            'product-create', 
            'product-update', 
            'product-delete'
        ], 
    },
    { 
        name: 'Stock', 
        children: [
            'stock-read', 
            'stock-update', 
            'stock-delete'
        ], 
    },
];