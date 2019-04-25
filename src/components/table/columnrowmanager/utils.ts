import { DEFAULT_WIDTH } from './constants';
import { IWeekSize, IWeekSizeRange } from './interface';
import { GMExcelTableColumnWithOrigin } from './../constants/interface';


export class ColumnManagerUtils{

  public static getSizeRange(column: GMExcelTableColumnWithOrigin, columns: GMExcelTableColumnWithOrigin[], otherWidth?: number): IWeekSizeRange {
    // sizeRange 规则
    // * cell minWidth 1. 用户传值 2. 初始不存在width的为初始width 3.默认minWidth
    // *. cell maxWidth 1. 用户传值 2. 初始不存在width的为初始width的3倍 3.默认minWidth

    let maxTotalTableWidth = otherWidth || 0;
    // let minTotalTableWidth = otherWidth || 0;
    const getMaxWidth = (col: GMExcelTableColumnWithOrigin) => {
      const width = col.origin.width || col.width;
      if (!col.maxWidth && width) {
        return width * 3;
      }
      return column.origin.maxWidth || DEFAULT_WIDTH.max;
    }
    const getMinWidth = (col: GMExcelTableColumnWithOrigin) => {
      const width = col.origin.width || col.width;
      if (!col.minWidth && width) {
        return width;
      }
      return column.origin.minWidth || DEFAULT_WIDTH.min
    }

    const otherTotalSize = columns.reduce((prev, current) => {
      if (column.key !== current.key) {
        if (current.width) {
          prev.width += current.width;
        }
        if (current.height) {
          prev.height += current.height;
        }
      }
      maxTotalTableWidth += getMaxWidth(current);
      // minTotalTableWidth += current.origin.minWidth || DEFAULT_WIDTH.min;
      return prev;
    }, { width: 0, height: 0 });

    let minWidth = getMinWidth(column);
    let maxWidth = getMaxWidth(column);
    maxWidth = Math.min(maxWidth, maxTotalTableWidth - otherTotalSize.width);

    return { width: { min: minWidth, max: maxWidth }}
  }


  static isValidSize(sizeRange: IWeekSizeRange, size: IWeekSize): boolean {

    let isWidthValid = true;
    if (size.width) {
      const minWidth = sizeRange.width && sizeRange.width.min || DEFAULT_WIDTH.min;
      const maxWidth = sizeRange.width && sizeRange.width.max || DEFAULT_WIDTH.max;
      if (size.width < minWidth || size.width > maxWidth) {
        isWidthValid =  false;
      }
    }

    let isHeightValid = true;


    if ((size.width && !isWidthValid) || (size.height && !isHeightValid)) {
      return false;
    }

    return true;
  }

  public static getValidSize(sizeRange: IWeekSizeRange, size: IWeekSize) {
    const validSize = size;
    if (size.width) {
      const minWidth = sizeRange.width && sizeRange.width.min || DEFAULT_WIDTH.min;
      const maxWidth = sizeRange.width && sizeRange.width.max || DEFAULT_WIDTH.max;
      if (size.width < minWidth) {
        validSize.width =  minWidth;
      }
      if (size.width > maxWidth) {
        validSize.width =  maxWidth;
      }
    }
    return validSize;
  }
}