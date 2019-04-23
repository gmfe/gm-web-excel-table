
import './index.less'
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { Button } from 'antd';
import * as React from 'react';
import { GMExcelTableProps, CellSelectedState } from './interface';
import { ResizeableTitle } from './cells/resizeabletitle';
import { EditableInputFormRow, EditableInputCell } from './cells/editableinputcell';
import ReactDataSheet from 'react-datasheet';
import {
  rowDragSource, rowDropTarget,
} from './enhance/drag-drop.js'
import ColumnHeader from './columnheader';
import { isFunction } from 'lodash'

import { VariableSizeList as List } from 'react-window';
import { IColumn } from './constants/columns';

const ROW_DRAGGER_WIDTH = 20;
const RowRenderer = rowDropTarget(rowDragSource((props: any) => {
  const { isOver, disable, children, connectDropTarget, connectDragPreview, connectDragSource } = props;
  const className = isOver ? 'drop-target' : ''
  return connectDropTarget(connectDragPreview(
    <tr className={className}>
      {disable ? null : connectDragSource(<td className='cell read-only row-handle' key='$$actionCell' style={{ width: ROW_DRAGGER_WIDTH }} />)}
      {children}
    </tr>
  ))
}));


// export function withCustomStaticConfig() {
//   return class extends React.Component<any, any> {
//     render() {
//       return (<TableExcel {...this.props} />)
//     }
//   }
// }


export class SheetBody extends React.Component<any, any> {


  handleRowDrop = (from: any, to: any) => {
    // console.log(from, to, 'fromfromfromfromfrom')
    const data = [...this.props.data]
    data.splice(to, 0, ...data.splice(from, 1));
    // console.log(data, 'datadata')
    this.props.dataManager.setData(data);
  }

  renderRow = (props: any) => {
    const { row, cells, ...rest } = props
    // can disable
    return <RowRenderer rowIndex={row} onRowDrop={this.handleRowDrop} {...rest} />
  }

  renderDataEditor = (props: any) => {
    const { dataManager } = this.props;
    return (<input ref={c => {
      if (c) c.focus();
    }} style={{ margin: 0, width: '100%', height: '100%' }} onChange={function (e) {
      // console.log(e.target.value, props, 'onCellsChangedonCellsChanged')
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

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.columnsMapData.length !== this.props.columnsMapData.length) {
      return true;
    }
    return true;
    // return false;
  }


  componentDidMount() {
    // need to listen cell length change dirty for
  }


  render() {
    // TODO 静态样式配置拆出去
    const {
      tableWidth,
      onTableLoad,
      tableController,
    } = this.props;


    return (
      <div ref={(c: any) => (c && onTableLoad && onTableLoad(c))} style={{ height: 200, overflowY: 'scroll'}}>

        <ReactDataSheet
          overflow="nowrap"
          data={this.props.columnsMapData}
          valueRenderer={(cell: any) => cell.value}
          onCellsChanged={(changes: any) => {
            console.log(changes, 'onCellsChanged')
          }}
          className={"ReactDataSheet"}
          // cellRenderer={(props: any) => {
          //   // https://github.com/nadbm/react-datasheet#cell-renderer
          //   const { cell, style, selected, className } = props;
          //   console.log(props, 'classNameclassNameclassName')
          //   return <td style={{ ...style, display: 'inline-block' }} className={className}>{cell.value}</td>
          // }}
          selected={tableController.selectedCells}
          rowRenderer={this.renderRow}
          onSelect={(select: CellSelectedState) => {
            tableController.select(select);
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
    )
  }
}


export default class TableExcel extends React.PureComponent<GMExcelTableProps, any> {

  private _tableWidth?: number;

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

  render() {

    // todo add memorize 
    // editable

    // todo resize header 
    // sheetRenderer 每次会销毁header， 所以重做
    console.log('OrderTable1', this.props)

    const {
      columns,
      columnRowManager,
      onTableLoad,
      dataManager,
      tableController,
    } = this.props;

    // const rowHeights = new Array(1500)
    //   .fill(true)
    //   .map(() => 25 + Math.round(Math.random() * 50));

    // const getItemSize = (index: any) => rowHeights[index];

    // const Row = ({ index, style }: any) => (
    //   <div style={style}>Row {index}</div>
    // );

    // const Example = () => (
    //   <List
    //     height={150}
    //     itemCount={1000}
    //     itemSize={getItemSize}
    //     width={300}
    //   >
    //     {Row}
    //   </List>
    // );

    // TODO need calWidth
    if (!this._tableWidth) {
      this._tableWidth = columns.reduce((a, b) => a + b.width, 0) + ROW_DRAGGER_WIDTH;
    }

    console.log(this._tableWidth, 'this._tableWidththis._tableWidth')
    return (
      <div
        className="gm-excel-table"
        style={{
          overflowX: 'scroll',
          paddingBottom: 20,
          border: '1px solid #ccc',
          margin: 5,
          // width:
        }}
      >
      <div style={{ width: this._tableWidth }}>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            Add a row
          </Button>

          <ColumnHeader
            columns={columns}
            containerStyle={{ paddingLeft: ROW_DRAGGER_WIDTH  }}
            onResizeColumn={(...args: any) => {
              // TODO get
              this._tableWidth = columns.reduce((a, b) => a + b.width, 0) + ROW_DRAGGER_WIDTH;
              return columnRowManager.onResizeColumn(...args);
            }}
            onResizeStart={columnRowManager.onResizeColumnStart}

          />
          <SheetBody {...this.props} tableWidth={this._tableWidth} />
      </div>

      </div>
    )
  }
}

