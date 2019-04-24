import { IColumnManager } from './columnrowmanager/interface';
import { AppBase } from './../../core/appbase';
import { IColumn } from './constants/columns';
import { TableRef } from '.';




export type TableDataManagerAdd = (item: any, rowIndex?: number, callback?: () => void) => void;

export interface CellSelectedState {
  start: { i: number, j: number}
  end: { i: number, j: number}
}

export interface GMExcelTableProps {
  app: AppBase;
  data: any[];

  containerStyle?: Object;
  className?: string;
  tableWidth?: number;
  canDragRow?: boolean;

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
  columnRowManager: IColumnManager;
  onTableLoad?: (container: HTMLElement) => void;
  tableRef: (ref: TableRef) => void;
}
