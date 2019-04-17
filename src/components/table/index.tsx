
// import Table from 'rc-table';
import './index.less'
import { Table, Button, Form, Input } from 'antd';
import * as React from 'react';

import { AppBase } from '../../core/appbase';
import { GMExcelTableProps } from './interface';
import { TableTransactionUtil } from './transactions/transactionutil';
import { ResizeableTitle } from './cells/resizeabletitle';
import { EditableInputFormRow, EditableInputCell } from './cells/editableinputcell';






export default class TableExcel extends React.Component<GMExcelTableProps, any> {
  // private _app: AppBase;
  constructor(props: GMExcelTableProps) {
    super(props);

    this.state = {
      columns: [{
        title: 'Date',
        dataIndex: 'date',
        width: 200,
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        width: 100,
        editable: true,
      }, {
        title: 'Type',
        dataIndex: 'type',
        width: 100,
      }, {
        title: 'Note',
        dataIndex: 'note',
        width: 100,
      }, {
        title: 'Action',
        key: 'action',
        render: (text: any, record: any, index: number) => (
          <a href="javascript:;" onClick={() => {
            this.handleDelete(index);
          }}>Delete</a>
        ),
      }],
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

  render() {

    // todo add memorize 
    // editable
    const columns = this.state.columns.map((col: any, index: number) => ({
      ...col,
      onHeaderCell: (column: any) => {
        return {
          width: column.width,
          onResize: this.handleResize(index),
        }
      },
      onCell: (record: any, rowIndex: number) => ({
        record,
        title: col.title,
        editable: col.editable,
        dataIndex: col.dataIndex,
        handleSave: (newitem: any) => this.handleSave(newitem, rowIndex),
      }),
    }));

    return (
      <div className="gm-excel-table">
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          bordered
          columns={columns}
          pagination={false}
          dataSource={this.props.data}
          components={this.components}
        />
      </div>
    )
  }
}

