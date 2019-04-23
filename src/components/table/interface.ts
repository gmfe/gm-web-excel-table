import { AppBase } from './../../core/appbase';




export type TableDataManagerAdd = (item: any, rowIndex?: number, callback?: () => void) => void;

export interface CellSelectedState {
  start: { i: number, j: number}
  end: { i: number, j: number}
}

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
  tableController: {
    select: (state: CellSelectedState) => void,
    selectedCells: null | CellSelectedState;
  }
  columnRowManager: any;
  onTableLoad?: (container: HTMLElement) => void,
}