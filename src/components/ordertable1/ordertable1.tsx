import * as React from 'react';

import TableExcel from '../table';
import { GM_TABLE_COLUMNS, IColumn, GM_TABLE_COLUMNS_KEYS } from '../table/constants/columns';
import { WithDataManager } from '../table/datamanager';
import { WithTableDataTrieSearch } from '../table/enhance/withtabledatatriesearch';

import { WithColumnRowManager } from '../table/columnrowmanager/with-column-row-manager';
import { configOrderTable1Columns, getCellDom } from './config';



// 拓展搜索
const OrderTableTest1WithTrieSearch = WithTableDataTrieSearch(
  TableExcel ,
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

  constructor (props: any) {
    super(props);

    // config columns

  }

  handleResize = (e: any) => {

    console.log(e, 'handleResize')
  }

  handleDelete = () => {

  }

  render() {
    console.log(this.props, 'render render columnRowManager')
    return (
      <OrderTableTest1 />
    )
  }

}

