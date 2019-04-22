import { AppBase } from './../../core/appbase';
import { IColumn } from './constants/columns';




export type TableDataManagerAdd = (item: any, rowIndex?: number, callback?: () => void) => void;

export interface GMExcelTableProps {
  app: AppBase;
  data: any[];
  columns: any[];
  dataManager: {
    onAdd: TableDataManagerAdd,
    onDelete: (index: number) => void,
    onSearch: () => void,
    onUpdate: (rowItem: any, rowIndex: number) => void,
  }
  columnRowManager: any;
  onTableLoad?: (container: HTMLElement) => void,
}