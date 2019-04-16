
// import Table from 'rc-table';
import './index.less'
import { Table, Button, Form, Input } from 'antd';
import * as React from 'react';
import { Resizable } from 'react-resizable';
import { AppBase } from '../../core/appbase';
import { GMExcelTableProps } from './interface';
import { TableTransactionUtil } from './transactions/transactionutil';

const FormItem = Form.Item;
const EditableContext = React.createContext(null);

const data = [{
  key: 0,
  date: '2018-02-11',
  amount: 120,
  type: 'income',
  note: 'transfer',
}, {
  key: 1,
  date: '2018-03-11',
  amount: 243,
  type: 'income',
  note: 'transfer',
}, {
  key: 2,
  date: '2018-04-11',
  amount: 98,
  type: 'income',
  note: 'transfer',
}];

const ResizeableTitle = (props: any) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

const EditableRow = ({ form, index, ...props }: any) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component<any, any> {

  public input: any;
  public form: any;

  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = (e:any) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error: any, values: any) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form: any) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

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
      data,

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
      row: EditableFormRow,
      cell: EditableCell,
    }
  };

  handleAdd = () => {
    const { data } = this.state;
    const newData = {
      key: data.length,
      date: '2018-02-11',
      amount: 120,
      type: 'income',
      note: 'transfer',
    };
    this.setState({
      data: [...data, newData],
    });
  }

  handleDelete = (index: number) => {

    // [].splice()
    this.state.data.splice(index, 1);
    this.setState({ data: this.state.data })
  }

  handleSave = (row: any) => {
    const newData = [...this.state.data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    const groupTransaction = TableTransactionUtil.createGroupTransaction(this.props.app);
    TableTransactionUtil.createEditCellTransaction(this.props.app, item, row.amount, index, (commitedData: any, index: number) => {
      console.log(commitedData, index, 'groupTransaction222')
      newData.splice(index, 1, commitedData);
      this.setState({ data: newData });
    }, groupTransaction);

    this.props.app.transactionManager().commit(groupTransaction);

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
      onCell: (record: any) => ({
        record,
        title: col.title,
        editable: col.editable,
        dataIndex: col.dataIndex,
        handleSave: this.handleSave,
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
          dataSource={this.state.data}
          pagination={false}
          components={this.components}
        />
      </div>
    )
  }
}

