import { IWeekSize, DEFAULT_WIDTH, IWeekSizeRange, IColumnWithOrigin } from './constants';


export class ColumnManagerUtils{

  public static getSizeRange(column: IColumnWithOrigin, columns: IColumnWithOrigin[]): IWeekSizeRange {

    // TODO here this is should maxWidth
    const totalTableWidth = 1220 // columns.reduce((a, b) => a + b.width, 0) + 20; // ROW_DRAGGER_WIDTH;

    const otherTotalSize = columns.reduce((prev, current) => {
      if (column.key !== current.key) {
        if (current.width) {
          prev.width += current.width;
        }
        if (current.height) {
          prev.height += current.height;
        }
      }
      return prev;
    }, { width: 0, height: 0 });

    let minWidth = column.origin.minWidth || DEFAULT_WIDTH.min;
    let maxWidth = column.origin.maxWidth || DEFAULT_WIDTH.max;
    // if (tableContainer) {
    //   if (column.origin.width) {
    //     minWidth = Math.min(column.origin.width, minWidth);
    //   } else  {
    //     if (column.width) {
    //       minWidth = Math.min(column.width, minWidth);
    //     }
    //   }
      console.log(totalTableWidth, otherTotalSize.width, 'tableContainer.offsetWidth')
      maxWidth = Math.min(maxWidth, totalTableWidth - otherTotalSize.width - 2);
    // }
    return { width: { min: minWidth, max: maxWidth }, height: { }}
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