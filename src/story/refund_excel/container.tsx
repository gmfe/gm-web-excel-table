

import * as React from 'react';
import { configOrderTable1Columns, GM_REFUND_TABLE_COLUMNS_KEYS } from './config';
import {
  MoveEditType,
  // SearchRenderProps,
  GMTableExcelStaticConfigWrapper,
} from '../../components';

import 'react-gm/src/index.less'
import './style/index.less';
import { IDataManagerChangeType } from '../../components/table/datamanager/interface';
import { RefundExcelTable_AllData, RefundExcelTable_Detail, Data_IRefundExcel, RefundExcelTable_Props } from './interface';



// const searchKeys = [
//   'orderName',
//   'chargerPerson',
// ]
// const DEFAULT_DATA = {
//   orderName: '',
//   category: '',
//   returnOrderNumber: 0,
//   returnOrderPerPrice: 0,
//   fillPriceDiff: 0, // 补差价
//   returnTotalPrice: 0, // 退货金额	
//   chargerPerson: '' // '操作人'
// }




/**
 * 商品退货表格配置 | 列配置请查看 ./config
 *
 * @export
 * @class TabelExcelContainer
 * @extends {React.PureComponent<any, any>}
 */
export default class TabelExcelContainer extends React.PureComponent<RefundExcelTable_Props, any> {

  private _dataManagerRef: any;

  componentDidUpdate() {
    // render层属于静态配置，动态传值将不会更新，使用 updateData 做纯数据相关更新
    if (this._dataManagerRef) {
      this._dataManagerRef.updateData();
    }
  }

  /**
   * 业务结构映射为开发结构
   *
   * @memberof TabelExcelContainer
   */
  static dataMap2TableData = (data: RefundExcelTable_AllData): Data_IRefundExcel[] => {
    return data.details.map((d: RefundExcelTable_Detail, dindex: number) =>
      TabelExcelContainer.stationDetailMap2TableDetail(d, dindex, data.creator)
    );
  }
  /**
   * station detial 字段映射为开发字段
   *
   * @static
   * @memberof TabelExcelContainer
   */
  static stationDetailMap2TableDetail = (d: RefundExcelTable_Detail, dindex: number, creator: string): Data_IRefundExcel => {
    return {
      id: d.id,
      remain: d.remain,
      hasEdit: d.hasEdit,
      std_unit: d.std_unit,
      selected_sum: d.selected_sum,

      rowKey: `refund-table-row-${dindex}`,
      orderName: d.name || '',
      category: d.category || '',
      chargerPerson: creator,
      returnBatchNumner: d.batch_number,
      returnTotalPrice: d.money,
      returnOrderNumber: d.quantity,
      fillPriceDiff: d.different_price,
      returnOrderPerPrice: d.unit_price,
    }
  }
  /**
   * table detail 字段映射为 station detail 字段
   *
   * @static
   * @memberof TabelExcelContainer
   */
  static tableDetailMap2StationDetail = (detailOrigin: Data_IRefundExcel): RefundExcelTable_Detail => {
    return {
      id: detailOrigin.id,
      name: detailOrigin.orderName,
      hasEdit: detailOrigin.hasEdit,
      category: detailOrigin.category,
      std_unit: detailOrigin.std_unit,
      money: detailOrigin.returnTotalPrice,
      selected_sum: detailOrigin.selected_sum,
      quantity: detailOrigin.returnOrderNumber,
      different_price: detailOrigin.fillPriceDiff,
      batch_number: detailOrigin.returnBatchNumner,
      unit_price: detailOrigin.returnOrderPerPrice,
    }
  }

  /**
   * 开发逻辑转发给业务逻辑
   *
   * @memberof TabelExcelContainer
   */
  handleDataChange = (type: IDataManagerChangeType, args: any) => {
    // console.log(type, args, this.props.data, 'handleDataChange')
    switch (type) {
      case IDataManagerChangeType.addRow: {
        this.props.onAddRow(args.add as any[], args.rowIndex, args.callback);
        break;
      }
      case IDataManagerChangeType.deleteRow: {
        this.props.onDeleteRow(args.rowIndex, args.callback);
        break;
      }
      case IDataManagerChangeType.updateCell: {
        switch (args.columnKey) {
          case GM_REFUND_TABLE_COLUMNS_KEYS.orderName: {
            this.props.onOrderNameChange(args.item, args.rowIndex);
            break;
          }
          case GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber: {
            this.props.onReturnOrderNumberChange(args.item.quantity, args.rowIndex);
            break;
          }
          case GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice: {
            this.props.onReturnOrderPerPriceChange(args.item.unit_price, args.rowIndex);
            break;
          }
          case GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice: {
            this.props.onReturnTotalPriceChange(args.item.money, args.rowIndex);
            break;
          }
        }
        break;
      }
    }
  }

  handleBatchClick = (detailOrigin: Data_IRefundExcel, index: number) => {
    this.props.onClickSelectBatch(TabelExcelContainer.tableDetailMap2StationDetail(detailOrigin), index);
  }

  render() {

    // console.log(this.props, 'container container')

    return (
      <GMTableExcelStaticConfigWrapper
        // app={APP} // 多个表格实例的时候可以在共同容器中使用独立实例

        tableKey='refund-excel'

        controllerConfig={{
          noneInputClickValidList: [
            'cell-orderName',
            'gm-more-select-selected',
          ],
          moveEdit: {
            [MoveEditType.arrow]: {
              allowUpAddRow: true, // 允许向上增行
              allowDownAddRow: true, // 允许向下增行
              allowRightArrowDownAddRow: false, // 允许向下增行
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
          sortable: false,
          resizable: false,
          showPagination: false,
          // style: { height: 400 },
        }}

        searchConfig={{
          enable: false,
          indexKey: 'key',
          searchKeys: [],
          // SearchRenderer: SearchRenderer
        }}

        columnsConfig={{
          getColumns: configOrderTable1Columns,
          columnContext: this.props.columnContext
        }}

        dataConfig={{
          defaultData: {
            name: '',
            std_unit: '',
            category: '', // 分类
            money: '',  // 退货金额	
            quantity: '', // 退货数量
            unit_price: '', // 退货单价
            different_price: '',  // 补差价
            isDefaultData: true,
          },
          controlled: true,
          data: this.props.data,
          onDataChange: this.handleDataChange,
          getData: () => {
            // 必须指定rowKey用于表格定位
            return TabelExcelContainer.dataMap2TableData(this.props.data)
          },
          getOriginTableData: () => {
            return this.props.data.details;
          },
          getProps: () => this.props,
          dataManagerRef: (c: any) => { this._dataManagerRef = c; }
        }}

        custom={{
          onSearchOrderName: this.props.onSearchOrderName,
          onClickSelectBatch: this.handleBatchClick,
        }}
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