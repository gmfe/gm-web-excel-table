import { TableRef } from '../table';

import { AppBase, ClientAppModel } from 'kunsam-app-model';

import { IColumnManager, IGetColumnsFunc } from './columnrowmanager/interface';

export * from './constants/interface'
export * from './columnrowmanager/interface'

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


export interface GMConfigData<T> {
  fetchData: Promise<T>
  fillBlankData: Object,
  initData: T[] // mocksDatas(20),
}


export interface SearchRenderProps{
  searchValue: '';
  searchResults: any[]

  onReset: () => void;
  onSearch: (value: string) => void;
  onSelect: (rowIndex: number, colIndex: number) => void
}

export interface GMTableExcelSearchArgs {
  enable?: boolean;
  indexKey: string;  // 索引字段
  searchKeys: string[]; // 搜索的字段
  maxSearchResultLength?: number
  SearchRenderer?: React.ComponentClass<any, any>
}


export interface GMTableExcelStaticConfig {
  app?: ClientAppModel;
  tableKey: string;
  containerStyle: Object
  fullScreenWidth?: boolean, // 开启之后对于缺少指定width字段的cell补充满至全屏
  searchConfig: GMTableExcelSearchArgs,
  columnsConfig: {
    getColumns: IGetColumnsFunc
  }
  canDragRow?: boolean;
  dataConfig: GMConfigData<any>;
  tableRef: (tref: TableRef) => void;
}