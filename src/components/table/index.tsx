
// import Table from 'rc-table';
import './index.less'
import "react-table/react-table.css";
import { Table, Button, Form, Input } from 'antd';
import * as React from 'react';
import { GMExcelTableProps } from './interface';
import { ResizeableTitle } from './cells/resizeabletitle';
import { EditableInputFormRow, EditableInputCell } from './cells/editableinputcell';

import ReactDataSheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { isString, isFunction } from 'lodash'

import {
  colDragSource, colDropTarget,
  rowDragSource, rowDropTarget,
} from './enhance/drag-drop.js'
import { IColumn } from './constants/columns';

const Header = colDropTarget(colDragSource((props: any) => {
  const { col, connectDragSource, connectDropTarget, isOver } = props
  const className = isOver ? 'cell read-only drop-target' : 'cell read-only'
  return connectDropTarget(
    connectDragSource(
      <th className={className} style={{ width: col.width }}>{col.label}</th>
    ))
}))


class SheetRenderer extends React.PureComponent<any, any> {
  render () {
    const { className, columns, onColumnDrop } = this.props
    return (
      <table className={className}>
        <thead>
          <tr>
            <th className='cell read-only row-handle' key='$$actionCell' />
            {
              columns.map((col: any, index: any) => (
                <Header key={col.label} col={col} columnIndex={index} onColumnDrop={onColumnDrop} />
              ))
            }
          </tr>
        </thead>
        <tbody>
          {this.props.children}
        </tbody>
      </table>
    )
  }
}

const RowRenderer = rowDropTarget(rowDragSource((props: any) => {
  const { isOver, children, connectDropTarget, connectDragPreview, connectDragSource } = props
  const className = isOver ? 'drop-target' : ''
  return connectDropTarget(connectDragPreview(
    <tr className={className}>
      { connectDragSource(<td className='cell read-only row-handle' key='$$actionCell' />)}
      { children }
    </tr>
  ))
}))


export default class TableExcel extends React.Component<GMExcelTableProps, any> {
  // private _app: AppBase;
  constructor(props: GMExcelTableProps) {
    super(props);

    this.state = {
    }
  }

  handleResize = (index: any) => (e: any, { size }: any) => {
    this.setState(({ columns }: any) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
    body: {
      row: EditableInputFormRow,
      cell: EditableInputCell,
    }
  };

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
    // const columns = this.state.columns.map((col: any, index: number) => ({
    //   ...col,
    //   onHeaderCell: (column: any) => {
    //     return {
    //       width: column.width,
    //       onResize: this.handleResize(index),
    //     }
    //   },
    //   onCell: (record: any, rowIndex: number) => ({
    //     record,
    //     title: col.title,
    //     editable: col.editable,
    //     dataIndex: col.dataIndex,
    //     handleSave: (newitem: any) => this.handleSave(newitem, rowIndex),
    //   }),
    // }));

    // todo resize header 
    // sheetRenderer 每次会销毁header， 所以重做
    console.log('OrderTable1', this.props)
    const { columnRowManager } = this.props;
    return (
      <div className="gm-excel-table">
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>

        
        <ReactDataSheet
          overflow="nowrap"
          data={this.props.data}
          // sheetRenderer={props => {
          //   return (
          //     <SheetRenderer
          //       columns={this.props.columns}
          //       onColumnDrop={this.handleColumnDrop}
          //       {...props}
          //     />
          //   )
          // }}
          sheetRenderer={props => {
            console.log(props, 'propspropsprops')
            return (
              <table className={props.className + ' my-awesome-extra-class'}>
                <thead>
                  <tr>
                    {
                      this.props.columns.map((column: IColumn, index: number) => {
                        const key = column.dataIndex || `columns${index}`;
                        let header = null;
                        if (isFunction(column.Header)) {
                          header = <th key={key}>{column.Header(column)}</th>;
                        } else {
                          header = <th key={key}>{column.Header}</th>;
                        }
                        if (column.resizeable === false) {
                          return header;
                        }
                        return (
                          <ResizeableTitle
                            key={key}
                            width={column.width}
                            onResize={columnRowManager.onResizeColumn(index)}
                          >
                            {header}
                          </ResizeableTitle>
                        );

                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {props.children}
                </tbody>
              </table>
            )
          }}
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


        {/* <ReactTable
          data={this.props.data}
          resolveData={data => data.map(row => row)}
          resizable={false}
          sortable={false}
          // [resize is broken] https://github.com/tannerlinsley/react-table/issues/1084
          className="-striped -highlight"
          columns={this.props.columns}
          showPagination={false}
          // pivotBy={[]}
          onPageSizeChange={() => {
            console.log('onPageSizeChange')
          }}
        /> */}
      </div>
    )
  }
}

