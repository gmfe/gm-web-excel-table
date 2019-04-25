import { GMExcelTableColumn } from './../table/constants/interface';



export enum GM_TABLE_COLUMNS_KEYS {
  date = 'date',
  type = 'type',
  note = 'note',
  amount = 'amount',
}

export interface IGM_TABLE_COLUMNS {
  [GM_TABLE_COLUMNS_KEYS.date]: GMExcelTableColumn;
  [GM_TABLE_COLUMNS_KEYS.type]: GMExcelTableColumn;
  [GM_TABLE_COLUMNS_KEYS.note]: GMExcelTableColumn;
  [GM_TABLE_COLUMNS_KEYS.amount]: GMExcelTableColumn;
}

