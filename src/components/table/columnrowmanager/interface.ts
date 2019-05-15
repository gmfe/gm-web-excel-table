import { ColumnProps } from 'antd/lib/table';
import { IDataManager } from '../datamanager/interface';



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

export type IGetColumnsFunc = (props: ConfigColumnProps<any>, columnRowManager: IColumnManager) => ColumnProps<any>[];

export interface WithColumnRowManagerConfig{
  getColumns: IGetColumnsFunc 
}
