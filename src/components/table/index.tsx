
import './index.less'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { Button } from 'antd';
import * as React from 'react';

import { GMExcelTableProps } from './interface';

import { ResizeableTitle } from './cells/resizeabletitle';
import { EditableInputFormRow, EditableInputCell } from './cells/editableinputcell';
import ReactDataSheet from 'react-datasheet';
import HTML5Backend from 'react-dnd-html5-backend'
import {
  // colDragSource, colDropTarget,
  rowDragSource, rowDropTarget,
} from './enhance/drag-drop.js'
import ColumnHeader from './columnheader';
import { DragDropContextProvider } from 'react-dnd';


const ROW_DRAGGER_WIDTH = 20;
const RowRenderer = rowDropTarget( rowDragSource( (props: any) => {
  const { isOver, disable, children, connectDropTarget, connectDragPreview, connectDragSource } = props;
  const className = isOver ? 'drop-target' : ''
  return connectDropTarget(connectDragPreview(
    <tr className={className}>
      {disable ? null : connectDragSource(<td className='cell read-only row-handle' key='$$actionCell' style={{ width: ROW_DRAGGER_WIDTH }} />)}
      {children}
    </tr>
  ))
} ) );




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
      note: 'transfer',
      date: '2018-02-11',
      key: this.props.data.length,
    };
    this.props.dataManager.onAdd(newData);
  }

  handleDelete = (index: number) => {
    this.props.dataManager.onDelete(index);
  }

  handleSave = (rowItem: any, rowIndex: number) => {
    this.props.dataManager.onUpdate(rowItem, rowIndex);
  }

  handleRowDrop = (from: any, to: any) => {
    console.log(from, to, 'fromfromfromfromfrom')
    const data = [...this.props.data]
    data.splice(to, 0, ...data.splice(from, 1));
    console.log(data, 'datadata')
    this.props.dataManager.setData(data);
  }

  renderRow = (props: any) => {
    const { row, cells, ...rest } = props
    // can disable
    return <RowRenderer  rowIndex={row} onRowDrop={this.handleRowDrop} {...rest} />
  }


  renderDataEditor = (props: any) => {
    console.log(this, 'renderDataEditorrenderDataEditor')
    const { dataManager } = this.props;
    return (<input style={{ margin: 0, width: '100%', height: '100%' }} onChange={function(e) {
      console.log(e.target.value, props, 'onCellsChangedonCellsChanged')
      if (props.cell.dataIndex) {
        dataManager.onUpdate({ [props.cell.dataIndex]: e.target.value }, props.row)
      }
    }} />);
  }

  handleOnContextMenu = (event: MouseEvent, cell: any, i: any, j: any) => {
    console.log(event, cell, i, j, 'handleOnContextMenuhandleOnContextMenu')
    event.preventDefault();
    // can show a menu
  }

  render() {

    // todo add memorize 
    // editable

    // todo resize header 
    // sheetRenderer 每次会销毁header， 所以重做
    console.log('OrderTable1', this.props)

    const { columns, columnRowManager, onTableLoad, dataManager } = this.props;
    // const columnsProps = columns.map(c => ({}))

    return (
      <div className="gm-excel-table">
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>

        <ColumnHeader
          columns={columns}
          containerStyle={{ paddingLeft: ROW_DRAGGER_WIDTH }}
          onResizeColumn={columnRowManager.onResizeColumn}
          onResizeStart={columnRowManager.onResizeColumnStart}
        />

        {/* <DragDropContextProvider backend={HTML5Backend}> */}
          <div ref={(c: any) => (c && onTableLoad && onTableLoad(c))}>
            <ReactDataSheet
              overflow="nowrap"
              data={this.props.columnsMapData}
              valueRenderer={(cell: any) => cell.value}
              onCellsChanged={(changes: any) => {
                console.log(changes, 'onCellsChanged')
              }}
              // { start: { i: number, j; number }, end: { i: number, j: number } }
              // selected={}
              // cellRenderer={(props: any) => {
              //   // https://github.com/nadbm/react-datasheet#cell-renderer
              //   const { cell, style, selected, className } = props;
              //   console.log(props, 'classNameclassNameclassName')
              //   return <td style={style} className={className}>{cell.value}</td>
              // }}
              rowRenderer={this.renderRow}
              onSelect={(select: any) => {
                console.log(select, 'onSelect')
              }}
              dataEditor={this.renderDataEditor}
              parsePaste={(string: string) => {
                console.log(string, 'parsePaste')
                return [];
              }}
              onContextMenu={this.handleOnContextMenu}
            />
          </div>
        {/* </DragDropContextProvider> */}
      </div>
    )
  }
}

