import { IDataManager } from './../datamanager/interface';
import { IColumn } from './../constants/columns';
import { IWeekSize } from './constants';


export interface ICellInDataSheet extends IColumn {
  value: string
}


export interface IColumnManager {
  onResizeRow: Function,
  onResizeColumnStart: (index: number) => () => void;
  findCellDom: (row: number, col: number) => HTMLElement | undefined;
  onResizeColumn: (index: number) => (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => boolean;
}

export interface IColumnManagerProps{
  data: any[]
  canDragRow?: boolean
  fullScreenWidth?: boolean
  dataManager: IDataManager<any>
}