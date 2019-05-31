import { TableControllerInterface } from '../../components/table/tablecontroller/interface';


export interface RefundExcelTable_DetailCommonProperty{
  id?: string
  remain?: number
  std_unit?: string
  hasEdit?: boolean
  selected_sum?: number
}


/**
 * [开发结构] 数据表格单元格数据结构
 *
 * @export
 * @interface Data_IRefundExcel
 */
export interface Data_IRefundExcel extends RefundExcelTable_DetailCommonProperty {
  category: string,
  orderName: string,
  returnOrderNumber: string,  // number
  returnOrderPerPrice: string, // number
  fillPriceDiff: string, // 补差价
  chargerPerson: string // '操作人' // number
  returnTotalPrice: string, // 退货金额	 // number
  returnBatchNumner?: string

  rowKey: string;
}

/**
 * [开发结构] 单元格拓展字段数据结构
 *
 * @export
 * @interface DataWithController_IRefundExcel
 * @extends {Data_IRefundExcel}
 */
export interface DataWithController_IRefundExcel extends Data_IRefundExcel {
  rowKey: string;
  index: number;
  tableController: TableControllerInterface
}


/**
 * [业务结构]: 单元格详情数据结构
 *
 * @export
 * @interface RefundExcelTable_Detail
 */
export interface RefundExcelTable_Detail extends RefundExcelTable_DetailCommonProperty {
  money: string
  name?: string
  quantity: string
  category?: string
  unit_price: string
  batch_number?: string
  different_price: string
}

export interface RefundExcelTable_SelectedData {
  name: string
  value: string
  std_unit: string
  category: string
  unit_price?: string
}

/**
 * [业务结构]: 后台全量数据字段结构
 *
 * @export
 * @interface RefundExcelTable_AllData
 */
export interface RefundExcelTable_AllData {
  id: string
  type: number
  status: number
  discount: any[]
  date_time: string
  sku_money: string
  station_id: string
  delta_money: number
  submit_time: string
  supplier_name: string
  settle_supplier_id: string
  batch_number: number | null

  creator: string
  details: RefundExcelTable_Detail[]
}
/**
 * [业务结构] 下拉列表数据结构
 *
 * @export
 * @interface GMOrderListDataStructure
 */
export interface GMOrderListDataStructure {
  label: string;
  children: {
    name: string
    value: string
    std_unit: string
    category: string
    unit_price?: number
  }[]
}

export interface RefundExcelTableCustomProps {
  onSearchOrderName: (value: string, rowIndex: number) => Promise<any>
  onClickSelectBatch: (detail: any, rowIndex: number) => void
}

export interface RefundExcelTable_Props extends RefundExcelTableCustomProps {

  loading?: boolean
  data: RefundExcelTable_AllData
  columnContext?: any; // 会影响列的配置

  onOrderNameChange: (selectedData: any, rowIndex: number) => void
  onReturnOrderNumberChange: (value: string, rowIndex: number) => void
  onReturnOrderPerPriceChange: (value: string, rowIndex: number) => void
  onReturnTotalPriceChange: (value: string, rowIndex: number) => void

  onAddRow: (addList: any[], startRowIndex?: number, callback?: Function) => void
  onDeleteRow: (rowIndexes: number[], callback?: Function) => void
}

