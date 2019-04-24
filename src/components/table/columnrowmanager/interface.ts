import { IColumn } from './../constants/columns';
import { IWeekSize } from './constants';


export interface ICellInDataSheet extends IColumn {
  value: string
}


export interface IColumnManager {
  onResizeColumnStart: (index: number) => () => void;
  onResizeColumn: (index: number) => (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => boolean;
  onResizeRow: Function,
  findCellDom: (row: number, col: number) => HTMLElement | undefined;
}