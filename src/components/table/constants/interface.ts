

import { ClientAppModel } from 'kunsam-app-model';
import { IGetColumnsFunc } from '../columnrowmanager/interface';
import { WithTableControllerConfig } from '../tablecontroller/interface';

import { TableRef } from '../components/react-table';
import { TableProps } from 'react-table'
import { RefundExcelTableCustomProps } from '../../../story/refund_excel/interface';



export interface CellSelectedState {
  start: { i: number, j: number}
  end: { i: number, j: number}
}


export interface GMConfigData<T> {


  defaultData: T
  fetchData?: Promise<T>

  initData?: T[]
  controlled?: boolean // 受控状态
  getProps?: () => any
  getData?: () => T[] // 受控状态下必须传值
  getOriginTableData?: () => any[] // 获得原始数据列表数据
  onDataChange?: (...args: any[]) => void
  // // 通知dataManager更新数据，避免全部高阶函数重新生成
  dataManagerRef?: (obj: {
    updateData: () => void
  }) => void
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
  containerStyle?: Object;
  dataConfig: GMConfigData<any>;
  tableRef?: (tref: TableRef) => void;
  searchConfig: GMTableExcelSearchArgs;
  tableConfig: Partial<TableProps<any, any>>;
  controllerConfig: WithTableControllerConfig;
  columnsConfig: {
    getColumns: IGetColumnsFunc;
    columnContext?: any;
  }
  custom: RefundExcelTableCustomProps
}