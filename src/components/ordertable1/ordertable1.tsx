
import { Button } from 'antd';
import * as React from 'react';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd';
import { configOrderTable1Columns } from './config';
import { GMTableExcelStaticConfigWrapper, TableRef } from '../table';




const rrr = (max: number = 9) => Math.floor(Math.random() * (max + 1));
const mocksDatas = (len: number) => {
  return new Array(len).fill(null).map((a, index) => ({
    type: `type${index}`,
    note: `note${index}`,
    date: `20${rrr(2)}${rrr()}-0${rrr()}-${rrr(2)}${rrr()}`,
    amount: Math.ceil(Math.random() * (1000)),
  }))
}


const data = [{
  date: '2018-02-11',
  amount: 120,
  type: 'income',
  note: 'transfer',
}, {
  date: '2018-03-11',
  amount: 243,
  type: 'income',
  note: 'transfer',
}, {
  date: '2018-04-11',
  amount: 98,
  type: 'income',
  note: 'transfer',
}];



export class TabelExcelWrapper extends React.PureComponent<any, any> {

  private _tableRef?: TableRef;

  handleAdd = () => {
    const newData = {
      amount: 120,
      type: 'income',
      note: 'transfer',
      date: '2018-02-11',
      key: this.props.data.length,
    };
    if (this._tableRef) {
      this._tableRef.addBlank()
    }
    // this.props.dataManager.onAdd(newData);
  }

  // handleDelete = (index: number) => {
  //   this.props.dataManager.onDelete(index);
  // }

  render() {
    return (
      <div>

        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>

        {/* { 这里都是静态配置 } */}
        <GMTableExcelStaticConfigWrapper
          {...this.props}
          tableRef={(c: TableRef) => this._tableRef = c}
          tableKey='key'
          containerStyle={{
            margin: 5,
            paddingBottom: 20,
            border: '1px solid #ccc',
          }}
          fullScreenWidth

          canDragRow// NOTICE 

          searchConfig={{
            enable: true,
            indexKey: 'key',
            searchKeys: ['date', 'type', 'note'],
          }}

          columnsConfig={{
            getColumns: configOrderTable1Columns,
          }}
          dataConfig={{
            fillBlankData: {
              amount: null,
              type: '',
              note: '',
              date: '',
            },
            initData: mocksDatas(20),
            fetchData: Promise.resolve(),
          }}

          // 这里应该还有一些事件订阅

          // onCellChanged

          // fetchData: Promise.resolve()
          // onResizeColumn={this.onResizeColumn}
          // onResizeColumnStart={columnRowManager.onResizeColumnStart}
        />

      </div>
    )
  }
}



export class OrderTable1 extends React.Component<any, any>  {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <TabelExcelWrapper {...this.props} />
      </DragDropContextProvider>
    )
  }
}

