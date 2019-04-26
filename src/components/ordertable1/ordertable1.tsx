
import { Button, Radio, Checkbox } from 'antd';
import * as React from 'react';

import { configOrderTable1Columns, SearchRenderer } from './config';
import { GMTableExcelStaticConfigWrapper, TableRef } from '../table';
import { SingleReactApp } from '../../client/app';

// import GMET from '../../../dist/main'
// console.log(GMET, 'SingleReactApp')

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
const APP = new SingleReactApp()
export class TabelExcelWrapper extends React.PureComponent<any, any> {

  private _tableRef?: TableRef;

  handleAdd = () => {
    if (this._tableRef) {
      this._tableRef.addBlank()
    }
    // this.props.dataManager.onAdd(newData);
  }

  // handleDelete = (index: number) => {
  //   this.props.dataManager.onDelete(index);
  // }

  componentDidMount() {
    // const GG = require('../../../dist/main')
    // console.log(GMET, GG, 'GMETGMET')
  }

  render() {
    return (
      <div>

        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a Blank row
        </Button>

        <Button onClick={() => {
          if (this._tableRef) {
            this._tableRef.add({
              amount: 120,
              type: 'income',
              note: 'transfer',
              date: '2018-02-11',
            })
          }
        }} type="primary" style={{ marginBottom: 16, marginLeft: 10 }}>
          Add a Item Row
        </Button>

        {/* { 这里都是静态配置 } */}
        <GMTableExcelStaticConfigWrapper
          // app={APP}
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
            SearchRenderer: SearchRenderer
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
        // onScrollToBottom

        // fetchData: Promise.resolve()
        // onResizeColumn={this.onResizeColumn}
        // onResizeColumnStart={columnRowManager.onResizeColumnStart}
        />

        <div style={{ padding: 10 }}>
          <h3>基本功能</h3>
          <div><Checkbox checked>基本增删查改</Checkbox></div>
          <div><Checkbox checked>表格头拖动</Checkbox></div>
          <div><Checkbox checked>表格列拖动</Checkbox></div>
          <div><Checkbox checked>搜索定位</Checkbox></div>
          <div><Checkbox checked>点击选择 | 快捷键移动</Checkbox></div>

          <div><Checkbox checked>提供热键注册机制</Checkbox></div>
          <div><Checkbox checked>提供Undo/Redo注册机制</Checkbox></div>
          <div><Checkbox checked>提供鼠标事件注册机制</Checkbox></div>

          <div><Checkbox checked>提供快捷使用容器</Checkbox></div>
        </div>

        <div style={{ padding: 10 }}>
          <h3>待开发</h3>
          <div><Radio>大数据性能优化</Radio></div>
          <div><Radio>数据保存与缓存</Radio></div>
        </div>

        <div style={{ padding: 10 }}>
          <h3>业务逻辑</h3>
          <div>
            <Radio>业务逻辑制定</Radio>
            <Radio>单元格定制</Radio>
            <Radio>单元格事件定时</Radio>
          </div>

          <div style={{ padding: 10 }}>
            <h3>TODO</h3>
            <div>
              <Radio>右键菜单</Radio>
              <Radio>项目抽离与发布</Radio>
              <Radio>公式阵列[感觉暂时不用]</Radio>
              <Radio>项目interface与plugin等static output</Radio>
            </div>

          </div>

        </div>

      </div>
    )
  }
}



export class OrderTable1 extends React.Component<any, any>  {
  render() {
    return (
      <TabelExcelWrapper {...this.props} />
    )
  }
}

