


import * as React from 'react'
import { IWeekSize, WithColumnRowManagerConfig, IWeekSizeRange, IColumnWithOrigin } from './constants';
import { ColumnManagerUtils } from './utils';






// 只与行列操作有关的逻辑
export function WithColumnRowManager(Target: React.ComponentClass<any, any>) {

  return (configOption: WithColumnRowManagerConfig) => {
    const CellId = (ri: number, ci: number) => `${1}${ci}`;    return class extends React.Component<any, { columns: IColumnWithOrigin[] }> {
    
      private _columnRowManager: any;
      private _tableContainerDom?: HTMLElement;
      private _tableCellDomMap: Map<string, HTMLElement>;
      private _currentSizeRange?: IWeekSizeRange ;
  
      constructor(props: any) {
        super(props);
        this._columnRowManager = {
          onResizeColumnStart: this.handleResizeColumnStart,
          onResizeColumn: this.handleResizeColumn,
          onResizeRow: this.hanldeResizeRow,
          findCellDom: this.findCellDom,
        }
        this.state = {
          columns: configOption.getColumns(this.props, this._columnRowManager).map(c => ({ ...c, origin: {}}))
        };
        this._tableCellDomMap = new Map();
      }
  
      handleResizeColumnStart = (index: number) => () => {
        const nextColumns = [...this.state.columns];
        this._currentSizeRange = ColumnManagerUtils.getSizeRange(nextColumns[index], this.state.columns, this._tableContainerDom);
        nextColumns[index]  = {
          ...nextColumns[index],
          minWidth: this._currentSizeRange.width && this._currentSizeRange.width.min,
          maxWidth: this._currentSizeRange.width && this._currentSizeRange.width.max,
        }
        this.setState({ columns: nextColumns })
      }
  
      // event, direction, refToElement, delta
      handleResizeColumn = (index: number) => (nextSize: IWeekSize, callback?: (size: IWeekSize) => void) => {
        const column = this.state.columns[index];
        if (!column) {
          return false;
        }
        const sizeRange = this._currentSizeRange;
        if (!sizeRange) {
          throw Error('make sure you cal sizeRange')
        }
        if(!ColumnManagerUtils.isValidSize(sizeRange, nextSize)) {
          if (callback) {
            callback(ColumnManagerUtils.getValidSize(sizeRange, nextSize));
          }
          return false;
        }
        this.setState(({ columns }: any) => {
          const nextColumns = [...columns];
          const column = nextColumns[index];
          if (nextSize.width) {
            column.width = nextSize.width;
          }
          nextColumns[index] = column;
          return { columns: nextColumns };
        }, () => {
          if (callback) {
            const nextColumn = this.state.columns[index];
            callback({ width: nextColumn.width });
          }
        });
        return true;
      }
  
   
      hanldeResizeRow() {
  
      }
  
      onTableLoaded = (container: HTMLElement) => {
        if (this._tableContainerDom && container.id === this._tableContainerDom.id) return;
  
        this._tableContainerDom = container;
        const columnsWithSize = this.state.columns.map((c, ci) => {
          if (!c.width) {
            // const fromMap = this._tableCellDomMap.get(CellId(0, ci));
            // const cellDom = fromMap || configOption.getCellDom(container, 0, ci);
            // if (!fromMap && cellDom) {
            //   this._tableCellDomMap.set(CellId(0, ci), cellDom);
            // }
            const cellDom = this.findCellDom(0, ci);
            if (cellDom) {
              return {
                ...c,
                width: cellDom.offsetWidth,
              }
            }
          }
          return { ...c };
        });
  
        const columnsWithRange = columnsWithSize.map(column => {
          const sizeRange = ColumnManagerUtils.getSizeRange(column, columnsWithSize, this._tableContainerDom);
          return {
            ...column,
            origin: { minWidth: column.minWidth, maxWidth: column.maxWidth, width: column.width },
            minWidth: sizeRange.width && sizeRange.width.min,
            maxWidth: sizeRange.width && sizeRange.width.max,
          }
        });
        this.setState(({ columns: columnsWithRange }))
      }
  
      columnsMaptoCells = (data: any[], columns: any[]) => {
        return data.map((rowData: any) => {
          return columns.map(column => {
            return {
              ...column,
              value: column.dataIndex ? rowData[column.dataIndex] : '',
              // updateValue: (value: any) => {
              //   this.props.dataMa
              //   console.log(value, this.props, 'componentProps')
              // }
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
          />
        )
      }
  
    }
  }



}
