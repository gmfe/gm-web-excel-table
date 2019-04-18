


import * as React from 'react'
import { IColumn } from '../constants/columns';


const DEFAULT_WIDTH = {
  min: 100,
  max: 1000
}

// 只与行列操作有关的逻辑
export function WithColumnRowManager(
  WrappedComponent: React.ComponentClass<any, any>,
  getColumns: (props: any, columnRowManager: any) => IColumn[], // or other config method
) {

  return class extends React.Component<any, { columns: IColumn[] }> {
    private _columnRowManager: any;
    constructor(props: any) {
      super(props);
      this._columnRowManager = {
        onResizeColumn: this.handleResizeColumn,
        onResizeRow: this.hanldeResizeRow,
      }
      this.state = {
        columns: getColumns(props, this._columnRowManager)
      };
    }

    handleResizeColumn = (index: number) => (_: any, data: any) => {

      const newWidth = data.size.width;
      const column = this.state.columns[index];
      if (!newWidth || !column) {
        return;
      }

      const minWidth = column.minWidth || DEFAULT_WIDTH.min;
      const maxWidth = column.maxWidth || DEFAULT_WIDTH.max;

      if (newWidth < minWidth || newWidth > maxWidth) {
        return;
      }

      this.setState(({ columns }: any) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: newWidth,
        };
        return { columns: nextColumns };
      });
    }

    hanldeResizeRow() {

    }

    mapData = (gridData: any[]) => {
      const columnMap = new Map();
      this.state.columns.forEach(column => column.dataIndex && columnMap.set(column.dataIndex, column));
      return gridData.map(rowData => {
        return rowData.map((rd: any) => {
          const column: IColumn | undefined = columnMap.get(rd.dataIndex);
          return Object.assign(rd, column ? { column } : {});
        });
      });
    }

    columnsMaptoCells(data: any[], columns: any[]) {
      return data.map((rowData: any) => {
        return columns.map(column => {
          return {
            ...column,
            value: column.dataIndex ? rowData[column.dataIndex] : '',
          }
        })
      })
    }

    render() {
      return (
        <WrappedComponent
          columns={this.state.columns}
          columnRowManager={this._columnRowManager}
          {...this.props}
          data={this.columnsMaptoCells(this.props.data, this.state.columns)}
        />
      )
    }

  }
}
