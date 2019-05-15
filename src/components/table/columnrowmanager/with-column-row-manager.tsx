
import * as React from 'react'
import { IColumnManager, ConfigColumnProps } from './interface';
import { IWeekSize, WithColumnRowManagerConfig, IWeekSizeRange } from './interface';
import { ColumnProps } from 'antd/lib/table';



// TODO HANDlE Resize

// 只与行列操作有关的逻辑
export function WithColumnRowManager(Target: React.ComponentClass<any, any>) {

  return (configOption: WithColumnRowManagerConfig) => {
    const CellId = (_: number, ci: number) => `${1}${ci}`;
    
    return class extends React.Component<ConfigColumnProps<any>, any> {
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
        console.log(this.state.tableWidth, container.offsetWidth, container.clientWidth, 'this.state.tableWidththis.state.tableWidth')
        if (this._tableContainerDom && container.id === this._tableContainerDom.id) return;
        this._tableContainerDom = container;
      }
  
      columnsMaptoCells = (data: any[], columns: ColumnProps<any>[]): any[][] => {
        return data.map((rowData: any) => {
          return columns.map(column => {
            return {
              ...column,
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
        } = this.props;
        return (
          <Target
            {...this.props}
            onTableLoad={this.onTableLoaded}
  
            columns={this.state.columns}
            columnRowManager={this._columnRowManager}
            columnsMapData={this.columnsMaptoCells(data, this.state.columns)}

            // TODO 需要有种机制 标记最初的来源负责人是哪
          />
        )
      }
  
    }
  }



}
