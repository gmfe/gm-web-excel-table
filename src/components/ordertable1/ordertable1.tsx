import * as React from 'react';
import * as moment from 'moment';
import TableExcel from '../table';
import { GM_TABLE_COLUMNS, IColumn } from '../table/constants/columns';
import { WithDataManager } from '../table/datamanager';
import { WithTableDataTrieSearch } from '../table/enhance/withtabledatatriesearch';
import { DatePicker } from 'antd';
import { WithColumnRowManager } from '../table/columnrowmanager/with-column-row-manager';



// 拓展搜索
const OrderTableTest1WithTrieSearch = WithTableDataTrieSearch(
  TableExcel ,
  'key',
  ['type', 'note']
);



// 业务表格配置
const OrderTableWithWithColumnRowManager = WithColumnRowManager(
  OrderTableTest1WithTrieSearch,
  (componentProps: any, columnRowManager: any) => {
    const columns: IColumn[] = [
      {
        ...GM_TABLE_COLUMNS.date,
        minWidth: 150,
        maxWidth: 600,
        Header: '日期',
        dataEditor: (props: any) => {
          const date = moment(props.value);
          // need add dataManager
          // console.log(props, 'propspropsprops')
          return (
            <DatePicker value={date} onChange={(data: any) => {
              console.log(data, 'DatePicker change' )
            }}/>
          );
        }
      },
      {
        ...GM_TABLE_COLUMNS.amount,
        Header: '数量',
      },
      {
        ...GM_TABLE_COLUMNS.type,
        Header: '类型',
        sortable: false,
      },
      {
        ...GM_TABLE_COLUMNS.note,
        Header: '文本',
        sortable: false,
      },
      {
        Header: 'action',
        disableEvents: true,
        valueViewer: (data: any) => {
          return (
            <a href="javascript:;" onClick={() => {
              // console.log(data, componentProps, 'columnRowManager props')
              componentProps.dataManager.onDelete(data.index);
            }}>Delete</a>
          );
        }
      }
    ];
    return columns;
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

