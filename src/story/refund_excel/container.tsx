

import * as React from 'react';
import { configOrderTable1Columns } from './config';
import {
  MoveEditType,
  // SearchRenderProps,
  GMTableExcelStaticConfigWrapper,
} from '../../components';

import 'react-gm/src/index.less'
import './style/index.less';


// const searchKeys = [
//   'orderName',
//   'chargerPerson',
// ]


const DEFAULT_DATA = {
  orderName: '',
  category: '',
  returnOrderNumber: 0,
  returnOrderPerPrice: 0,
  fillPriceDiff: 0, // 补差价
  returnTotalPrice: 0, // 退货金额	
  returnBatchNumber: 0, // 退货批次
  chargerPerson: '' // '操作人'
}

/**
 * 退货表格实例
 *
 * @export
 * @class TabelExcelContainer
 * @extends {React.PureComponent<any, any>}
 */
export default class TabelExcelContainer extends React.PureComponent<any, any> {
  render() {
   return (
      <GMTableExcelStaticConfigWrapper
        // app={APP} // 多个表格实例的时候可以在共同容器中使用独立实例
        // tableRef={(c: TableRef) => this._tableRef = c}
        tableKey='refund-excel'

        controllerConfig={{
          moveEdit: {
            [MoveEditType.arrow]: {
              allowUpAddRow: true, // 允许向上增行
              allowDownAddRow: true, // 允许向下增行
              allowColumnRightBreakRow: true,
              allowColumnLeftBackRow: true,
            },
            [MoveEditType.tab]: {
              allowDownAddRow: false, // 允许向下增行
            },
            [MoveEditType.enter]: {
              allowColumnRightBreakRow: true,
              allowDownAddRow: true, // 允许向下增行
            }
          },
        }}

        tableConfig={{
          // defaultPageSize: 1000,
          showPagination: false,
          resizable: false,
          style: { height: 400 },
          sortable: false,
        }}

        containerStyle={{
          border: '1px solid #ccc',
        }}

        searchConfig={{
          enable: false,
          indexKey: 'key',
          searchKeys: [],
          // SearchRenderer: SearchRenderer
        }}

        columnsConfig={{
          getColumns: configOrderTable1Columns,
        }}

        dataConfig={{
          defaultData: {
            orderName: '',
            category: '',
            returnOrderNumber: 0,
            returnOrderPerPrice: 0,
            fillPriceDiff: 0, // 补差价
            returnTotalPrice: 0, // 退货金额	
            returnBatchNumber: 0, // 退货批次
            chargerPerson: '' // '操作人'
          },
          initData: new Array(5).fill(DEFAULT_DATA)
        }}

        custom={{...this.props}}
      />

    )
  }
}


// 可暴露在外的全表格定位搜索组件，暂未开放

// export class SearchRenderer extends React.Component<SearchRenderProps<Data_IRefundExcel>> {
//   render() {
//     const { searchResults, searchValue, onSearch, onSelect, onReset } = this.props;
//     console.log(searchResults, searchValue, 'searchResults')
//     return (
//       <div>
//         <input value={searchValue} onChange={e => onSearch(e.target.value)} />
//         {searchResults.map((s: any) => <p onClick={() => {
//         }}>{s.value}</p>)}
//       </div>
//     )
//   }
// }