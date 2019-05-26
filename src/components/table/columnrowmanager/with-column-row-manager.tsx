
import * as React from 'react'

import { CellInfo } from 'react-table';
import { _GM_TABLE_SCROLL_CELL_PREFIX_ } from '../constants';
import { IWeekSize, WithColumnRowManagerConfig, IWeekSizeRange } from './interface';
import { IColumnManager, ConfigColumnProps, GMExtendedColumnProps } from './interface';


/**
 * 行列操作相关 如行列拖动，行列配置
 * 
 * @export
 * @param {React.ComponentClass<any, any>} Target
 * @returns
 */

export function WithColumnRowManager(Target: React.ComponentClass<any, any>) {

  return (configOption: WithColumnRowManagerConfig) => {

    return class extends React.Component<ConfigColumnProps<any>, any> {
      public _tableContainerDom?: HTMLElement;
      public _columnRowManager: IColumnManager;

      constructor(props: any) {
        super(props);
        this._columnRowManager = {}

        const columns = withUniqueEditableColumnsProps(
          configOption.getColumns(props, this._columnRowManager)
        );

        this.state = {
          columns,
        }

      }

      // hanldeResizeRow() {}

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

      render() {
        const {
          data,
        } = this.props;
        return (
          <Target
            {...this.props}
            columns={this.state.columns}
            onTableLoad={this.onTableLoaded}
            columnRowManager={this._columnRowManager}
          // columnsMapData={this.columnsMaptoCells(data, this.state.columns)}
          />
        )
      }

    }
  }

}


/**
 * 行列配置高阶函数
 *
 * @export
 * @param {GMExtendedColumnProps[]} data
 * @returns {GMExtendedColumnProps[]}
 */
export function withUniqueEditableColumnsProps(data: GMExtendedColumnProps[]): GMExtendedColumnProps[] {
  return data.map((d, dataIndex) => {
    const OldCellRender = d.Cell;
    d.Cell = (cell: CellInfo, column: any) => {
      return (
        <div
          className="gm-web-table-cell-container"
          id={`${_GM_TABLE_SCROLL_CELL_PREFIX_}${d.key}${cell.original.rowKey}`}
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
        >
          <div className="gm-web-table-cell">
            {OldCellRender ? (OldCellRender instanceof Function ? OldCellRender(cell, column) : OldCellRender) : cell.value}
          </div>
        </div>

      )
    }

    const OldHeaderRender = d.Header;
    d.Header = (cell: CellInfo, column: any) => {
      return (
        <div
          className="gm-web-table-header-cell-inner"
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
        >
          {OldHeaderRender ? (OldHeaderRender instanceof Function ? OldHeaderRender(cell, column) : OldHeaderRender) : cell.value}
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