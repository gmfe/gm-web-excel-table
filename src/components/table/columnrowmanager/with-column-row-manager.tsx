
import * as React from 'react'
import { ColumnManagerUtils } from './utils';
import { ROW_DRAGGER_WIDTH } from '../constants/config';
import { GMExcelTableColumn, GMExcelTableColumnWithOrigin } from '../constants/interface';
import { ICellInDataSheet, IColumnManager, ConfigColumnProps } from './interface';
import { IWeekSize, WithColumnRowManagerConfig, IWeekSizeRange } from './interface';



// TODO HANDlE Resize

// 只与行列操作有关的逻辑
export function WithColumnRowManager(Target: React.ComponentClass<any, any>) {

  return (configOption: WithColumnRowManagerConfig) => {
    const CellId = (_: number, ci: number) => `${1}${ci}`;
    
    return class extends React.Component<ConfigColumnProps, { tableWidth: undefined | number, columns: GMExcelTableColumnWithOrigin[] }> {
      public _tableContainerDom?: HTMLElement;
      public _columnRowManager: IColumnManager;
      public _currentSizeRange?: IWeekSizeRange ;
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
  
        const columns = configOption.getColumns(props, this._columnRowManager).map(c => ({ ...c, origin: {} }))
        this._tableCellDomMap = new Map();
        let tableWidth = undefined;

        // 全屏模式下不传入初始tableWidth
        if (!props.fullContainerWidth) {
          // 初始情况下全部均存在width
          this._isInitAllAssignWidth = columns.every(col => col.width !== undefined);
          if (this._isInitAllAssignWidth) {
            tableWidth = this.getTableWidth(columns);
          }
        }

        this.state = {
          tableWidth,
          columns,
        }
  
      }

      public getTableWidth(columns: GMExcelTableColumn[]) {
        return columns.reduce((a, b) => a + (b.width || 0), 0) + this.fixWidth;
      }

      handleResizeColumnStart = (index: number) => () => {
        const nextColumns = [...this.state.columns];
        this._currentSizeRange = ColumnManagerUtils.getSizeRange(nextColumns[index], this.state.columns, this.fixWidth);
        // console.log(this._currentSizeRange,  'this._currentSizeRange')
        nextColumns[index]  = {
          ...nextColumns[index],
          minWidth: this._currentSizeRange.width && this._currentSizeRange.width.min,
          maxWidth: this._currentSizeRange.width && this._currentSizeRange.width.max,
        }
        this.setState({ columns: nextColumns })
      }
  
      handleResizeColumn = (index: number) => (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => {
        const column = this.state.columns[index];
        if (!column) {
          return false;
        }
        const sizeRange = this._currentSizeRange; // KEY VALUE
        if (!sizeRange) {
          throw Error('make sure you cal sizeRange')
        }
        let isValid = true;
        if(!ColumnManagerUtils.isValidSize(sizeRange, nextSize)) {
          // if (callback) {
          //   callback(ColumnManagerUtils.getValidSize(sizeRange, nextSize));
          // }
          isValid = false;
          nextSize = ColumnManagerUtils.getValidSize(sizeRange, nextSize);
        }

        this.setState(({ columns, tableWidth }: any) => {
          const nextColumns = [...columns];
          const column = nextColumns[index];
          if (nextSize.width) {
            tableWidth -= column.width
            column.width = nextSize.width;
            tableWidth += nextSize.width;
          }
          nextColumns[index] = column;
          return { columns: nextColumns, tableWidth };
        }, () => {
          if (callback) {
            const nextColumn = this.state.columns[index];
            callback({ width: nextColumn.width });
          }
        });
        return isValid;
      }
  
      hanldeResizeRow() {
  
      }

      /**
       * 固定宽度
       *
       * @readonly
       */
      public get fixWidth() {
        return this.props.canDragRow ? ROW_DRAGGER_WIDTH : 0;
      }

      onTableLoaded = (container: HTMLElement) => {
        console.log(this.state.tableWidth, container.offsetWidth, container.clientWidth, 'this.state.tableWidththis.state.tableWidth')
        if (this._tableContainerDom && container.id === this._tableContainerDom.id) return;
        this._tableContainerDom = container;
        let tableWidth = this.fixWidth;
        let lastUndefinedWidthColIndex: number | undefined = undefined;
        const columnsWithSize = this.state.columns.map((c, ci) => {
          if (!c.width) {
            const cellDom = this.findCellDom(0, ci);
            if (cellDom) {
              c.width = cellDom.offsetWidth;
              lastUndefinedWidthColIndex = ci;
              // console.log(c, cellDom.clientWidth, cellDom.offsetWidth, 'cellDomcellDom')
            }
          }
          // tableWidth += c.width!;
          return { ...c };
        });
        if (this.props.fullContainerWidth) {
          tableWidth = container.clientWidth;
          if (lastUndefinedWidthColIndex !== undefined) {
            const otherTotalWidth = columnsWithSize.reduce((a, b, bindex) => {
              return a + (lastUndefinedWidthColIndex === bindex ? 0 : b.width || 0);
            }, 0) 
            console.log(tableWidth, otherTotalWidth, 'lastUndefinedWidthCollastUndefinedWidthCol')
            const newWidth = tableWidth - otherTotalWidth - this.fixWidth;
            const col = columnsWithSize[lastUndefinedWidthColIndex];
            if (!(
              (col.maxWidth && newWidth > col.maxWidth) ||
              (col.minWidth && newWidth < col.minWidth)
            )) {
              col.width = newWidth;
            }
          }
        } else {
          tableWidth += columnsWithSize.reduce((a, b) => a + (b.width || 0), 0);
        }
        // fullContainerWidth

        const columnsWithRange = columnsWithSize.map(column => {
          const sizeRange = ColumnManagerUtils.getSizeRange(column, columnsWithSize, this.fixWidth);
          return {
            ...column,
            origin: { minWidth: column.minWidth, maxWidth: column.maxWidth, width: column.width },
            minWidth: sizeRange.width && sizeRange.width.min,
            maxWidth: sizeRange.width && sizeRange.width.max,
          }
        });
        this.setState(({ columns: columnsWithRange, tableWidth }));
      }
  
      columnsMaptoCells = (data: any[], columns: GMExcelTableColumn[]): ICellInDataSheet[][] => {

        return data.map((rowData: any) => {
          return columns.map(column => {

            return {
              ...column,
              className: column.fixColumn ? 'fix-column' : '',
              value: column.dataIndex ? rowData[column.dataIndex] : '',
            }
          })
        })
      }
  
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
          // fullContainerWidth,
        } = this.props;
        return (
          <Target
            columns={this.state.columns}
            columnRowManager={this._columnRowManager}
            {...this.props}
            columnsMapData={this.columnsMaptoCells(data, this.state.columns)}
            onTableLoad={this.onTableLoaded}
            // TODO 需要有种机制 标记最初的来源负责人是哪
            tableWidth={ this.state.tableWidth }
          />
        )
      }
  
    }
  }



}
