import { CellSelectedState } from '../constants';
import { GMExtendedColumnProps } from './../columnrowmanager/interface';


export function RowcolIndextoSelectedState(rowIndex: number, colIndex: number): CellSelectedState {
  return { start: { i: rowIndex, j: colIndex }, end: { i: rowIndex, j: colIndex } }
}


export function withUniqueEditableColumnsProps(data: GMExtendedColumnProps<any>[]): GMExtendedColumnProps<any>[] {
  return data.map(d => {
    if (d.uniqueEditable) {
      if (!d.onCell) {
        d.onCell = (record: any, rowIndex: any) => {
          return {
            onClick: (_: any) => {
              record.tableController.edit({
                columnKey: d.key,
                rowKey: record.rowKey,
              });
            },
            // onBlur: (e: any) => {
            //   record.tableController.cancelEdit({
            //     columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
            //     rowKey: record.rowKey,
            //   });
            // }
            // onDoubleClick: event => {}, // double click row
            // onContextMenu: event => {}, // right button click row
            // onMouseEnter: event => {}, // mouse enter row
            // onMouseLeave: event => {}, // mouse leave row
          };
        }
      }
    }
    return d;
  })
}