
import * as React from 'react'
import { ColumnManagerUtils } from './utils';
import { ICellInDataSheet, IColumnManager } from './interface';
import { IColumn } from '../constants/columns';
import { IWeekSize, WithColumnRowManagerConfig, IWeekSizeRange, IColumnWithOrigin } from './constants';
import { ROW_DRAGGER_WIDTH } from '../constants/config';



// 只与行列操作有关的逻辑
export function WithColumnRowManager(Target: React.ComponentClass<any, any>) {

  return (configOption: WithColumnRowManagerConfig) => {
    const CellId = (ri: number, ci: number) => `${1}${ci}`;
    
    return class extends React.Component<{ data: any[], canDragRow?: boolean }, { tableWidth: undefined | number, columns: IColumnWithOrigin[] }> {
      private _tableContainerDom?: HTMLElement;
      private _columnRowManager: IColumnManager;
      private _currentSizeRange?: IWeekSizeRange ;
      private _tableCellDomMap: Map<string, HTMLElement>;
  
      constructor(props: any) {
        super(props);
        this._columnRowManager = {
          onResizeColumnStart: this.handleResizeColumnStart,
          onResizeColumn: this.handleResizeColumn,
          onResizeRow: this.hanldeResizeRow,
          findCellDom: this.findCellDom,
        }
  
        const columns = configOption.getColumns(this.props, this._columnRowManager).map(c => ({ ...c, origin: {}, width: c.width || 0 }))
        this._tableCellDomMap = new Map();
        let tableWidth = undefined;
        // 初始情况下全部均存在width
        const isInitAllAssignWidth = columns.every(col => col.width !== undefined);
        if (isInitAllAssignWidth) {
          tableWidth = this.getTableWidth(columns);
        }

        this.state = {
          tableWidth,
          columns,
        }
  
      }

      public getTableWidth(columns: IColumn[]) {
        return columns.reduce((a, b) => a + (b.width || 0), 0) + (this.props.canDragRow ? ROW_DRAGGER_WIDTH : 0);
      }


      handleResizeColumnStart = (index: number) => () => {
        const nextColumns = [...this.state.columns];
        this._currentSizeRange = ColumnManagerUtils.getSizeRange(nextColumns[index], this.state.columns, this.props.canDragRow ? ROW_DRAGGER_WIDTH : 0);
        console.log(this._currentSizeRange,  'this._currentSizeRange')
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

      onTableLoaded = (container: HTMLElement) => {
        if (this._tableContainerDom && container.id === this._tableContainerDom.id) return;
        this._tableContainerDom = container;
        let tableWidth = this.props.canDragRow ? ROW_DRAGGER_WIDTH : 0;
        const columnsWithSize = this.state.columns.map((c, ci) => {
          if (!c.width) {
            const cellDom = this.findCellDom(0, ci);
            if (cellDom) {
              c.width = cellDom.offsetWidth;
            }
          }
          tableWidth += c.width!;
          return { ...c };
        });
        const columnsWithRange = columnsWithSize.map(column => {
          const sizeRange = ColumnManagerUtils.getSizeRange(column, columnsWithSize, this.props.canDragRow ? ROW_DRAGGER_WIDTH : 0);
          return {
            ...column,
            origin: { minWidth: column.minWidth, maxWidth: column.maxWidth, width: column.width },
            minWidth: sizeRange.width && sizeRange.width.min,
            maxWidth: sizeRange.width && sizeRange.width.max,
          }
        });
        this.setState(({ columns: columnsWithRange, tableWidth }))
      }
  
      columnsMaptoCells = (data: any[], columns: IColumn[]): ICellInDataSheet[][] => {
        return data.map((rowData: any) => {
          return columns.map(column => {
            return {
              ...column,
              value: column.dataIndex ? rowData[column.dataIndex] : '',
            }
          })
        })
      }
  
      findCellDom = (row: number, col: number) => {
        const cellId = CellId(row, col);
        let cellDom = this._tableCellDomMap.get(cellId);
        if (this._tableContainerDom) {
          const fromTable = configOption.getCellDom(this._tableContainerDom, row, col);
          if (!cellDom && fromTable) {
            cellDom = fromTable;
            this._tableCellDomMap.set(cellId, fromTable);
          }
        }
        return cellDom;
      }
  
      render() {
        return (
          <Target
            columns={this.state.columns}
            columnRowManager={this._columnRowManager}
            {...this.props}
            data={this.props.data}
            columnsMapData={this.columnsMaptoCells(this.props.data, this.state.columns)}
            onTableLoad={this.onTableLoaded}
            tableWidth={this.state.tableWidth}
          />
        )
      }
  
    }
  }



}
