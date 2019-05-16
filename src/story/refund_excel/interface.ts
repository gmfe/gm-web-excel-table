import { TableControllerInterface } from '../../components/table/tablecontroller/interface';


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


export interface DataWithController_IRefundExcel extends Data_IRefundExcel {
  rowKey: string;
  tableController: TableControllerInterface
}