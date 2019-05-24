
import * as React from 'react'
import { IColumnManager, ConfigColumnProps, GMExtendedColumnProps } from './interface';
import { IWeekSize, WithColumnRowManagerConfig, IWeekSizeRange } from './interface';
import { _GM_TABLE_SCROLL_CELL_PREFIX_ } from '../constants';
import { CellInfo, TableCellRenderer } from 'react-table';




// TODO HANDlE Resize

// 只与行列操作有关的逻辑
export function WithColumnRowManager(Target: React.ComponentClass<any, any>) {

  return (configOption: WithColumnRowManagerConfig) => {
    const CellId = (_: number, ci: number) => `${1}${ci}`;

    return class extends React.Component<ConfigColumnProps<any>, any> {
      public _tableContainerDom?: HTMLElement;
      public _columnRowManager: IColumnManager;
      public _currentSizeRange?: IWeekSizeRange;
      public _tableCellDomMap: Map<string, HTMLElement>;
      public _isInitAllAssignWidth: boolean = false;

      constructor(props: any) {
        super(props);
        this._columnRowManager = {
          onResizeColumnStart: this.handleResizeColumnStart,
          onResizeColumn: this.handleResizeColumn,
          onResizeRow: this.hanldeResizeRow,
          findCellDom: this.findCellDom,
        }

        const columns = withUniqueEditableColumnsProps(configOption.getColumns(props, this._columnRowManager));
        this._tableCellDomMap = new Map();

        this.state = {
          columns,
        }

      }

      handleResizeColumnStart = (index: number) => () => {
      }

      handleResizeColumn = (index: number) => (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => {
        return true;
      }

      hanldeResizeRow() {

      }

      onTableLoaded = (container: HTMLElement) => {
        if (this._tableContainerDom && container.id === this._tableContainerDom.id) return;
        this._tableContainerDom = container;
      }

      // columnsMaptoCells = (data: any[], columns: Column[]): any[][] => {
      //   return data.map((rowData: any) => {
      //     return columns.map(column => {
      //       return {
      //         ...column,
      //         value: column.dataIndex ? rowData[column.dataIndex] : '',
      //       }
      //     })
      //   })
      // }

      public _getCellDom(tableContainerDom: HTMLElement, rowIndex: number, columnIndex: number): HTMLElement | undefined {
        const tbody = tableContainerDom.children[0].children[0].children[0];
        const tr = tbody.children[rowIndex];
        if (tr) {
          const cell = tr.children[columnIndex];
          return cell as HTMLElement;
        }
        return undefined;
      }

      findCellDom = (row: number, col: number) => {
        const cellId = CellId(row, col);
        let cellDom = this._tableCellDomMap.get(cellId);
        if (this._tableContainerDom) {
          const fromTable = this._getCellDom(this._tableContainerDom, row, col);
          if (!cellDom && fromTable) {
            cellDom = fromTable;
            this._tableCellDomMap.set(cellId, fromTable);
          }
        }
        return cellDom;
      }

      render() {
        const {
          data,
        } = this.props;
        return (
          <Target
            {...this.props}
            onTableLoad={this.onTableLoaded}
            columns={this.state.columns}
            columnRowManager={this._columnRowManager}
            // columnsMapData={this.columnsMaptoCells(data, this.state.columns)}
          // TODO 需要有种机制 标记最初的来源负责人是哪
          />
        )
      }

    }
  }



}


export function withUniqueEditableColumnsProps(data: GMExtendedColumnProps[]): GMExtendedColumnProps[] {
  return data.map((d, dataIndex) => {
    // if (d.uniqueEditable) {
    //   if (!d.onCell) {
    //     d.onCell = (record: any, rowIndex: any) => {
    //       return {
    //         onClick: (_: any) => {
    //           record.tableController.edit({
    //             columnKey: d.key,
    //             rowKey: record.rowKey,
    //           });
    //         },
    //         // onBlur: (e: any) => {
    //         //   record.tableController.cancelEdit({
    //         //     columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
    //         //     rowKey: record.rowKey,
    //         //   });
    //         // }
    //         // onDoubleClick: event => {}, // double click row
    //         // onContextMenu: event => {}, // right button click row
    //         // onMouseEnter: event => {}, // mouse enter row
    //         // onMouseLeave: event => {}, // mouse leave row
    //       };
    //     }
    //   }
    // }

    const OldCellRender = d.Cell;
    d.Cell = (cell: CellInfo, column: any) => {
      let style: any = { width: '100%', height: '100%' }
      // if (d.cellWidth) style.width = d.cellWidth;
      // if (d.minWidth) style.minWidth = d.minWidth;
      // if (d.maxWidth) style.maxWidth = d.maxWidth;
      return (
        <div
          style={style}
          className="gm-web-table-cell"
          // onClick={() => {
          //   console.log(cell, 'onEditStartonEditStart')
          // }}
          id={`${_GM_TABLE_SCROLL_CELL_PREFIX_}${d.key}${cell.original.rowKey}`}
        >
          {OldCellRender ? ( OldCellRender instanceof Function ?  OldCellRender(cell, column) : OldCellRender) : cell.value}
        </div>
      )
    }

    const OldHeaderRender = d.Header;
    d.Header = (cell: CellInfo, column: any) => {
      return (
        <div className="gm-web-table-header-cell-inner">
          {OldHeaderRender ? ( OldHeaderRender instanceof Function ?  OldHeaderRender(cell, column) : OldHeaderRender) : cell.value}
        </div>
      )
    }


    d.static = {
      index: dataIndex,
      width: d.width,
    }

    return d;
  })
}