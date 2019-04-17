

import * as React from 'react';
import TableExcel from '../table';
import { ColumnProps } from 'antd/lib/table';
import { GM_TABLE_COLUMNS } from '../table/columns';
import { WithDataManager } from '../table/datamanager';
import { WithTableDataTrieSearch } from '../table/enhance/withtabledatatriesearch';
 

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

const OrderTableWithDataManager = WithDataManager(
  TableExcel,
  data
)

const OrderTableTest1WithTrieSearch = WithTableDataTrieSearch(
  OrderTableWithDataManager,
  'key',
  ['type', 'note']
)

export const OrderTableTest1 = OrderTableTest1WithTrieSearch;


export class OrderTable1 extends React.Component<any, any>  {

  constructor (props: any) {
    super(props);
    const action = {
      ...GM_TABLE_COLUMNS.action,
      render: (text: any, record: any, index: number) => (
        <a href="javascript:;" onClick={() => {
          this.handleDelete(index);
        }}>Delete</a>
      ),
    }
    const COLUMNS: ColumnProps<any>[] = [
      GM_TABLE_COLUMNS.date,
      GM_TABLE_COLUMNS.date,
      GM_TABLE_COLUMNS.date,

    ]
  }

  handleDelete = (index: number) => {
    this.state.data.splice(index, 1);
    this.setState({ data: this.state.data });
  }

  render() {

    return (
      <div>

      </div>
    )
  }

}

