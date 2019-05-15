

// import "antd/dist/antd.css";


// import 'react-datasheet/lib/react-datasheet.css';

import * as React from 'react';
import { configOrderTable1Columns } from './config';
import { Data_IRefundExcel } from './interface';
import { GMTableExcelStaticConfigWrapper, SearchRenderProps } from '../../components';

import './index.less';

// import times from 'lodash/times'

const searchKeys = [
  'orderName',
  'chargerPerson',
]
const MOCK_DATA: Data_IRefundExcel[] = [
  {
    orderName: '商品名1',
    category: '分类1',
    returnOrderNumber: 55,
    returnOrderPerPrice: 100,
    fillPriceDiff: 2, // 补差价
    returnTotalPrice: 5500, // 退货金额	
    returnBatchNumber: 10, // 退货批次
    chargerPerson: 'miaomiao' // '操作人'
  }
]

const mockFetchData = new Promise((res, rej) => {
  setTimeout(() => {
    res(new Array(10).fill(MOCK_DATA[0]))
  })
})


export default class TabelExcelContainer extends React.PureComponent<any, any> {


  render() {
    return (
      <GMTableExcelStaticConfigWrapper
        // app={APP} // 多个表格实例的时候可以在共同容器中使用独立实例
        // tableRef={(c: TableRef) => this._tableRef = c}

        tableKey='key'

        tableConfig={{
          scroll: { x: 1300 }
        }}

        containerStyle={{
          margin: 5,
          paddingBottom: 20,
          border: '1px solid #ccc',
        }}

        searchConfig={{
          enable: false,
          indexKey: 'number',
          searchKeys: searchKeys,
          // SearchRenderer: SearchRenderer
        }}

        columnsConfig={{
          getColumns: configOrderTable1Columns,
        }}

        dataConfig={{
          defaultData: {
            amount: null,
            type: '',
            note: '',
            date: '',
          },
          initData: new Array(15).fill(MOCK_DATA[0]),
          fetchData: Promise.resolve(),
        }}

      // 这里应该还有一些事件订阅

      // onCellChanged
      // onScrollToBottom

      // fetchData: Promise.resolve()
      // onResizeColumn={this.onResizeColumn}
      // onResizeColumnStart={columnRowManager.onResizeColumnStart}
      />

    )
  }
}



export class SearchRenderer extends React.Component<SearchRenderProps<Data_IRefundExcel>> {
  render() {
    const { searchResults, searchValue, onSearch, onSelect, onReset } = this.props;
    console.log(searchResults, searchValue, 'searchResults')
    return (
      <div>
        <input value={searchValue} onChange={e => onSearch(e.target.value)} />
        {searchResults.map((s: any) => <p onClick={() => {
          // onSelect(s.rowIndex, s.colIndex);
          // onReset();
        }}>{s.value}</p>)}
      </div>
    )
  }
}