import * as React from 'react';

import TableExcel from '../table';
import { GM_TABLE_COLUMNS, IColumn, GM_TABLE_COLUMNS_KEYS } from '../table/constants/columns';
import { WithDataManager } from '../table/datamanager';
import { WithTableDataTrieSearch } from '../table/enhance/withtabledatatriesearch';

import { WithColumnRowManager } from '../table/columnrowmanager/with-column-row-manager';
import { configOrderTable1Columns, getCellDom } from './config';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import { WithTableController } from '../table/tablecontroller';



const tableWithContoller = WithTableController({
  component: TableExcel,
  tableKey: 'key'
})

// 拓展搜索
const OrderTableTest1WithTrieSearch = WithTableDataTrieSearch(
  tableWithContoller,
  'key',
  ['type', 'note']
);



// 业务表格配置
const OrderTableWithWithColumnRowManager = WithColumnRowManager({
  component: OrderTableTest1WithTrieSearch,
  getColumns: configOrderTable1Columns,
  getCellDom: getCellDom,
}

)

// https://github.com/nadbm/react-datasheet#cell-options
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

// 数据管理
const OrderTableWithDataManager = WithDataManager(
  OrderTableWithWithColumnRowManager,
  data, // todo fetchDataLogic
  null
);

export const OrderTableTest1 = OrderTableWithDataManager;



export class OrderTable1 extends React.Component<any, any>  {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <OrderTableTest1 {...this.props} />
      </DragDropContextProvider>
    )
  }
}

