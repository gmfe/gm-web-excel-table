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

export interface WithColumnRowManagerConfig{
  getColumns: (props: any, columnRowManager: any) => IColumn[] // or other config method
  getCellDom: (tableContainer: HTMLElement, rowIndex: number, columnIndex: number) => HTMLElement | undefined;
}

export interface IColumnWithOrigin extends IColumn{
  width: number;
  origin: {
    width?: number
    minWidth?: number
    maxWidth?: number
  }
}