
import './index.less'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { Button } from 'antd';
import * as React from 'react';
import { GMExcelTableProps } from './interface';
import { ResizeableTitle } from './cells/resizeabletitle';
import { EditableInputFormRow, EditableInputCell } from './cells/editableinputcell';
import ReactDataSheet from 'react-datasheet';

import {
  colDragSource, colDropTarget,
  rowDragSource, rowDropTarget,
} from './enhance/drag-drop.js'
import ColumnHeader from './columnheader';


const RowRenderer = rowDropTarget(rowDragSource((props: any) => {
  const { isOver, children, connectDropTarget, connectDragPreview, connectDragSource } = props
  const className = isOver ? 'drop-target' : ''
  return connectDropTarget(connectDragPreview(
    <tr className={className}>
      {connectDragSource(<td className='cell read-only row-handle' key='$$actionCell' />)}
      {children}
    </tr>
  ))
}))


export default class TableExcel extends React.Component<GMExcelTableProps, any> {

  constructor(props: GMExcelTableProps) {
    super(props);

    this.state = {
    }
  }

  components = {
    header: {
      cell: ResizeableTitle,
    },
    body: {
      row: EditableInputFormRow,
      cell: EditableInputCell,
    }
  };

  // 需要业务表格自己封装 
  handleAdd = () => {
    const newData = {
      amount: 120,
      type: 'income',
      key: this.props.data.length,
      note: 'transfer',
      date: '2018-02-11',
    };
    this.props.dataManager.onAdd(newData);
  }

  handleDelete = (index: number) => {
    this.props.dataManager.onDelete(index);
  }

  handleSave = (rowItem: any, rowIndex: number) => {
    this.props.dataManager.onUpdate(rowItem, rowIndex);
  }

  // handleColumnDrop = (from, to) => {
  //   const columns = [...this.state.columns]
  //   columns.splice(to, 0, ...columns.splice(from, 1))
  //   const grid = this.state.grid.map(r => {
  //     const row = [...r]
  //     row.splice(to, 0, ...row.splice(from, 1))
  //     return row
  //   })
  //   this.setState({ columns, grid });
  // }

  render() {

    // todo add memorize 
    // editable

    // todo resize header 
    // sheetRenderer 每次会销毁header， 所以重做
    console.log('OrderTable1', this.props)

    const { columns, columnRowManager, onTableLoad } = this.props;
    // const columnsProps = columns.map(c => ({}))

    return (
      <div className="gm-excel-table">
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>

        <ColumnHeader
          columns={columns}
          onResizeColumn={columnRowManager.onResizeColumn}
          onResizeStart={columnRowManager.onResizeColumnStart}
        />

        <div ref={(c: any) => (c && onTableLoad && onTableLoad(c))}>
          <ReactDataSheet
            overflow="nowrap"
            data={this.props.data}
            valueRenderer={(cell: any) => cell.value}
            onCellsChanged={(changes: any) => {
              console.log(changes, 'onCellsChanged')
            }}
            // { start: { i: number, j; number }, end: { i: number, j: number } }
            // selected={}
            onSelect={(select: any) => {
              console.log(select, 'onSelect')
            }}
          />
        </div>
      </div>
    )
  }
}

