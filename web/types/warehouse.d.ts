export {};

declare global {
    interface IWarehouseAttachment {
        file: { name: string; size: number };
        url: string;
        isImage: boolean;
        code: string;
    }

    interface IWarehouseResponse {
        id: string;
        code: string;
        nameEn: string;
        nameKh: string;
        managerId: string;
        manager: IUserResponse;
        address?: string;
        contactNumber?: string;
        logo?: IWarehouseAttachment | null;
        createdById?: string;
        createdBy?: IUserResponse;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }

    interface IWarehouse {
        code: string;
        nameEn: string;
        nameKh: string;
        managerId: string;
        address?: string;
        contactNumber?: string;
        logo?: IWarehouseAttachment | null;
    }
}
