import { IColumnManager, IColumnManagerProps } from './interface';
import { IColumn } from './../constants/columns';


export const DEFAULT_WIDTH = {
  min: 40,
  max: 1000
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

export type onResizeColumn = (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => boolean;

export type IGetColumnsFunc = (props: IColumnManagerProps, columnRowManager: IColumnManager) => IColumn[];

export interface WithColumnRowManagerConfig{
  getColumns: IGetColumnsFunc 
}

export interface IColumnWithOrigin extends IColumn{
  origin: {
    width?: number
    minWidth?: number
    maxWidth?: number
  }
}