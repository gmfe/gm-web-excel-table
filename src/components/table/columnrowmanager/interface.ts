import { Column } from 'react-table';

import { IDataManager } from '../datamanager/interface';


export interface GMExtendedColumnProps extends Column {
  key: string;
  fixed?: string;

  static?: any;
  _indexNumber?: number;
  // minWidth?: number;
  // maxWidth?: number;
  cellWidth?: string | number;
  uniqueEditable?: boolean; // 用于高阶函数快速获得唯一编辑态
  editable?: boolean;       // 用于计算可编辑矩阵，光标移动时有效目标等，可编辑单元格必须指定
}

export type onResizeColumn = (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => boolean;

export interface IColumnManager {
  onResizeRow: Function,
  onResizeColumn: (index: number) => onResizeColumn;
  onResizeColumnStart: (index: number) => () => void;
  findCellDom: (row: number, col: number) => HTMLElement | undefined;
}

export interface ConfigColumnProps<T> {
  data: T[]
  dataManager: IDataManager<T>
}

export interface IWeekSize{
  width?: number,
  height?: number
}

export interface IWeekSizeRange{
  width?: {
    min: number;
    max: number;
  },
  height?: {
    min: number;
    max: number;
  }
}

export type IGetColumnsFunc = (props: ConfigColumnProps<any>, columnRowManager: IColumnManager) => GMExtendedColumnProps[];

export interface WithColumnRowManagerConfig {
  getColumns: IGetColumnsFunc 
}
