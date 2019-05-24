

import { ClientAppModel } from 'kunsam-app-model';
import { IGetColumnsFunc } from '../columnrowmanager/interface';
import { WithTableControllerConfig } from '../tablecontroller/interface';

import { TableRef } from '../components/react-table';
import { TableProps } from 'react-table'



export interface CellSelectedState {
  start: { i: number, j: number}
  end: { i: number, j: number}
}


export interface GMConfigData<T> {
  initData: T[]
  defaultData: T
  fetchData: Promise<T>
}


export interface SearchRenderProps<T> {
  searchValue: string;
  searchResults: T[]
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


// 配置表格
export interface GMTableExcelStaticConfig {
  app?: ClientAppModel;
  tableKey: string;
  containerStyle?: Object
  searchConfig: GMTableExcelSearchArgs,
  columnsConfig: {
    getColumns: IGetColumnsFunc
  }
  controllerConfig: WithTableControllerConfig;
  dataConfig: GMConfigData<any>;
  tableConfig: Partial<TableProps<any, any>>;
  tableRef?: (tref: TableRef) => void;
}