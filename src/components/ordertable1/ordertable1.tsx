
import * as React from 'react';
import TableExcel from '../table';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd';
import { WithDataManager } from '../table/datamanager';
import { WithTableController } from '../table/tablecontroller';
import { configOrderTable1Columns, getCellDom } from './config';
import { WithTableDataTrieSearch } from '../table/enhance/withtabledatatriesearch';
import { WithColumnRowManager } from '../table/columnrowmanager/with-column-row-manager';
import { enhanceWithFlows } from '../../core/utils/enhancewithflows';


const rrr = (max: number = 9) => Math.floor(Math.random()*(max+1));
const mocksDatas = (len: number) => {
  return new Array(len).fill(null).map((a, index) => ({
    type: `type${index}`,
    note: `note${index}`,
    date: `20${rrr(2)}${rrr()}-0${rrr()}-${rrr(2)}${rrr()}`,
    amount: Math.ceil(Math.random()* (1000)),
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


// 出藏交付的组件
const DeliveryComponent = enhanceWithFlows(TableExcel, [
  // 拓展搜索
  { enhance: WithTableDataTrieSearch,
    args: {
      searchTrieKeys:   ['date', 'type', 'note'],
      indexKey: 'key'
    }
  },
  // 表格控制
  { enhance: WithTableController, args: { tableKey: 'key' }},
  // 业务表格配置 行列管理
  {
    enhance: WithColumnRowManager,
    args: {
      getColumns: configOrderTable1Columns,
      getCellDom: getCellDom,
    }
  },
  // 数据管理
  {
    enhance: WithDataManager,
    args: {
      initData: mocksDatas(20),
      defaultData: null,
      fetchData: Promise.resolve()
    }
  },
  // 静态配置
]);

export class OrderTable1 extends React.Component<any, any>  {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <DeliveryComponent {...this.props} />
      </DragDropContextProvider>
    )
  }
}

