import { AppBase } from './../../core/appbase';




export type TableDataManagerAdd = (item: any, rowIndex?: number, callback?: () => void) => void;

export interface GMExcelTableProps {
  app: AppBase;
  data: any[];
  columnsMapData: any[]; // map to DataSheetProps /node_modules/react-datasheet/types/react-datasheet.d.ts
  columns: any[];
  dataManager: {
    onSearch: () => void,
    onAdd: TableDataManagerAdd,
    setData: (data: any[]) => void,
    onDelete: (index: number) => void,
    onUpdate: (rowItem: any, rowIndex: number) => void,
  }
  columnRowManager: any;
  onTableLoad?: (container: HTMLElement) => void,
}