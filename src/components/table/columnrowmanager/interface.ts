import { GMExcelTableColumn } from './../constants/interface';
import { IDataManager } from './../datamanager/interface';


export interface ICellInDataSheet extends GMExcelTableColumn {
  value: string
}

export type onResizeColumn = (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => boolean;

export interface IColumnManager {
  onResizeRow: Function,
  onResizeColumn: (index: number) => onResizeColumn;
  onResizeColumnStart: (index: number) => () => void;
  findCellDom: (row: number, col: number) => HTMLElement | undefined;
}

export interface IColumnManagerProps{
  data: any[]
  canDragRow?: boolean
  fullScreenWidth?: boolean
  dataManager: IDataManager<any>
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

export type IGetColumnsFunc = (props: IColumnManagerProps, columnRowManager: IColumnManager) => GMExcelTableColumn[];

export interface WithColumnRowManagerConfig{
  getColumns: IGetColumnsFunc 
}
