export {};

declare global {
    interface IStockSummary {
        totalStocks: number;
        totalProducts: number;
        totalWarehouses: number;
        lowStockCount: number;
        outOfStockCount: number;
        totalStockQuantity: number;
        totalReceiveQuantity: number;
        totalIssueQuantity: number;
        totalTransferQuantity: number;
        totalAdjustmentQuantity: number;
    }
}