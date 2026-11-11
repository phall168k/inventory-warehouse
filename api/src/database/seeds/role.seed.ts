export const roles = [
    {
        nameEn: 'Purchase Officer',
        nameKh: 'មន្ត្រីបញ្ជាទិញ',
        permissions: [
            'user-read',
            'user-create',
            'user-update',
            'user-delete',
        ],
    },
    {
        nameEn: 'User Manager',
        nameKh: 'អ្នកគ្រប់គ្រងអ្នកប្រើប្រាស់',
        permissions: [
            'role-read',
            'role-create',
            'role-update',
            'role-delete',
            'user-read',
            'user-create',
            'user-update',
            'user-delete',
        ],
    }
];
