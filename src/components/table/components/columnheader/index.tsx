
import React, { PureComponent } from 'react'
import { isFunction } from 'lodash'
import { ResizeableTitle } from '../../cells/resizeabletitle';
import { GMExcelTableColumn } from '../../constants/interface';

export default class ColumnHeader extends PureComponent<{
  columns: GMExcelTableColumn[],
  onResizeColumn: Function,
  onResizeStart: Function,
  containerStyle?: Object,
}> {
  render() {
    const { columns, onResizeColumn, onResizeStart, containerStyle = {} } = this.props;
    return (
      <div style={containerStyle}>
        {
          columns.map((column: GMExcelTableColumn, index: number) => {
            // 没有header也需要保持宽高
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
                key={`${key}${(column as any).origin.width}`}
                width={column.width}
                minWidth={column.minWidth}
                maxWidth={column.maxWidth}
                onResize={onResizeColumn(index)}
                onResizeStart={onResizeStart(index)}
              >
                {header}
              </ResizeableTitle>
            );
          })
        }
      </div>
    )
  }
}
