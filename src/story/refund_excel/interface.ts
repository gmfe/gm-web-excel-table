

export interface Data_IRefundExcel {
  category: string,
  orderName: string,
  returnOrderNumber: number,
  returnOrderPerPrice: number,
  fillPriceDiff: number, // 补差价
  chargerPerson: string // '操作人'
  returnTotalPrice: number, // 退货金额	
  returnBatchNumber: number, // 退货批次
}