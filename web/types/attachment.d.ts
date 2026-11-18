export {};

declare global {
    interface IAttachment { 
        code: string; 
        file: { 
            name: string; 
            size?: number 
        }; 
        url?: string; 
        isImage?: boolean 
    }
}