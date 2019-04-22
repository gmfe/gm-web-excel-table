
import React, { PureComponent } from 'react'
import { isFunction } from 'lodash'
import { IColumn } from '../constants/columns';
import { ResizeableTitle } from '../cells/resizeabletitle';

export default class ColumnHeader extends PureComponent<{ columns: IColumn[], onResizeColumn: Function, onResizeStart: Function }> {
  render() {
    const { columns, onResizeColumn, onResizeStart } = this.props;
    return (
      <div>
        {
          columns.map((column: IColumn, index: number) => {
            const key = column.dataIndex || `columns${index}`;
            let header = null;
            if (isFunction(column.Header)) {
              header = column.Header(column)
            } else {
              header = column.Header;
            }
            if (column.resizeable === false) {
              return <span key={key}>{header}</span>;
            }
            return (
              <ResizeableTitle
                key={key}
                width={column.width}
                minWidth={column.minWidth}
                maxWidth={column.maxWidth}
                onResize={onResizeColumn(index)}
                onResizeStart={onResizeStart(index)}
              >
                <span>{header}</span>
              </ResizeableTitle>
            );
          })
        }
      </div>
    )
  }
}
