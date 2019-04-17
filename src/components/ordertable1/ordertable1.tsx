

import * as React from 'react';
import TableExcel from '../table';
import { GM_TABLE_COLUMNS } from '../table/columns';
import { WithDataManager } from '../table/datamanager';
import { WithTableDataTrieSearch } from '../table/enhance/withtabledatatriesearch';
import { Column } from 'react-table';
 

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



const OrderTableTest1WithTrieSearch = WithTableDataTrieSearch(
  TableExcel ,
  'key',
  ['type', 'note']
);

// 数据管理
const OrderTableWithDataManager = WithDataManager(
  OrderTableTest1WithTrieSearch,
  data, // todo fetchDataLogic
  null
);


export const OrderTableTest1 = OrderTableWithDataManager;


export class OrderTable1 extends React.Component<any, any>  {

  protected columns: Column[] = [];

  constructor (props: any) {
    super(props);
    // const action = {
    //   ...GM_TABLE_COLUMNS.action,
    //   render: (text: any, record: any, index: number) => (
    //     <a href="javascript:;" onClick={() => {
    //       this.handleDelete(index);
    //     }}>Delete</a>
    //   ),
    // }

    // const COLUMNS: Column[] = [
    //   {
    //     Header: 'Name',
    //     accessor: 'name' // String-based value accessors!
    //   },
    //   {
    //     Header: 'Age',
    //     accessor: 'age',
    //     Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    //   },
    //   {
    //     id: 'friendName', // Required because our accessor is not a string
    //     Header: 'Friend Name',
    //     accessor: d => d.friend.name // Custom value accessors!
    //   },
    //   {
    //     Header: props => <span>Friend Age</span>, // Custom header components!
    //     accessor: 'friend.age'
    //   }
    // ]

    this.columns = [
      GM_TABLE_COLUMNS.date,
      GM_TABLE_COLUMNS.amount,
      GM_TABLE_COLUMNS.type,
      GM_TABLE_COLUMNS.note,
      {
        Header: 'action',
        Cell: (props: any) => {
          console.log(props, 'cell');
          return (
            <a href="javascript:;" onClick={() => {
              this.handleDelete();
            }}>Delete</a>
          );
        }
      }
    ]
  }

  handleDelete = () => {

  }

  render() {

    return (
      <OrderTableTest1 columns={this.columns} />
    )
  }

}

