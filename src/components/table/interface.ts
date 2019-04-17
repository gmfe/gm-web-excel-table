import { AppBase } from './../../core/appbase';




export type TableDataManagerAdd = (item: any, rowIndex?: number, callback?: () => void) => void;

export interface GMExcelTableProps {
  app: AppBase;
  data: any[];
  dataManager: {
    onAdd: TableDataManagerAdd,
    onDelete: (index: number) => void,
    onSearch: () => void,
    onUpdate: (rowItem: any, rowIndex: number) => void,
  }
}