
import { ColumnProps } from 'antd/lib/table';
import * as React from 'react';
import { Data_IRefundExcel, DataWithController_IRefundExcel } from './interface';
import { ConfigColumnProps, IGetColumnsFunc, IColumnManager } from '../../components/table/columnrowmanager/interface';
import { Header } from './components/header';
import SearchSelect from './components/cells/search-select';


export enum GM_REFUND_TABLE_COLUMNS_KEYS {
  number = 'number', // 序号
  orderName = 'orderName', // 商品名
  orderCategory = 'orderCategory', // 商品分类
  returnOrderNumber = 'returnOrderNumber', // 退货数
  returnOrderPerPrice = 'returnOrderPerPrice', // 退货单价
  fillPriceDiff = 'fillPriceDiff', // 补差
  returnTotalPrice = 'returnTotalPrice', // 退货金额
  returnBatchNumber = 'returnBatchNumber', // 退货批次
  chargerPerson = 'chargerPerson', // 退货批次
}



// dataManager
// columnRowManager
// tableController

export const configOrderTable1Columns: IGetColumnsFunc = (componentProps: ConfigColumnProps<Data_IRefundExcel>, columnrowmanager: IColumnManager) => {

  // 序号 | 商品名 | 商品分类 | 退货数 | 退货单价 | 补差 | 退货金额 | 退货批次 | 	操作人

  const columns: ColumnProps<DataWithController_IRefundExcel>[] = [

    // 序号
    {
      width: 49,
      title: Header('序号'),
      fixed: 'left',
      defaultSortOrder: 'ascend',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.number,
      render: (_: any, __: DataWithController_IRefundExcel, index: number) => {
        return index;
      },
    },


    // 操作
    {
      key: 'action',
      width: 113,
      fixed: 'left',
      title: Header('操作'),
      render: (_: any, __: any, index: number) => {
        return (
          <div> 
            <a style={{ cursor: 'pointer'}} onClick={() => {
              componentProps.dataManager.onAdd(undefined, index+ 1);
            }}>添加</a>
            <a style={{ marginLeft: 5, cursor: 'pointer'}} onClick={() => {
              componentProps.dataManager.onDelete(index);
            }}>删除</a>
          </div>
        )
      },
    },

    // 商品名
    {
      title: '商品名',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
      width: 250,
      dataIndex: 'orderName',
      render: (text: string, record: DataWithController_IRefundExcel, index: number) => {

        const isEditing = record.tableController.query.isEditing({
          columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
          rowKey: record.rowKey,
        });

        // console.log(isEditing, index, 'indexindexindex')

        return (
          <div>
            { isEditing ? <SearchSelect value={text} onSelect={(value: string) => {

              componentProps.dataManager.onUpdate({ orderName: value }, index);
            }}/> : text }
          </div>
        )
      },
      onCell: (record: DataWithController_IRefundExcel, rowIndex: any) => {
        return {
          onClick: (e: any) => {
            record.tableController.uniqueEdit({
              columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
              rowKey: record.rowKey,
            });
          },
          // onBlur: (e: any) => {
          //   record.tableController.cancelEdit({
          //     columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
          //     rowKey: record.rowKey,
          //   });
          // }
          // onDoubleClick: event => {}, // double click row
          // onContextMenu: event => {}, // right button click row
          // onMouseEnter: event => {}, // mouse enter row
          // onMouseLeave: event => {}, // mouse leave row
        };
      }
    },

    // 商品分类
    {
      title: '商品分类',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderCategory,
      width: 110,
      dataIndex: 'category'
    },

    // 退货数
    {
      title: '退货数',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
      width: 200,
      dataIndex: 'returnOrderNumber',
      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return text;
      },
      // dataEditor: (props: any) => {
      //   console.log(componentProps, props, 'componentProps')
      //   return <input onChange={e => {
      //     console.log(e.target.value, 'onChange')
      //   }}></input>
      // }
    },

    // 退货单价
    {
      title: '退货单价',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,
      width: 80,
      dataIndex: 'returnOrderPerPrice',
      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return text;
      },
    },

    // 补差
    {
      title: '补差',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.fillPriceDiff,
      width: 80,
      dataIndex: 'fillPriceDiff'
    },

    // 退货金额
    {
      title: '退货金额',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,
      width: 100,
      dataIndex: 'returnTotalPrice',
      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return text;
      },
    },

    // 退货批次
    {
      title: '退货批次',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnBatchNumber,
      width: 100,
      dataIndex: 'returnBatchNumber',
      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return index;
      },
    },

    // 操作人
    {
      title: '操作人',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.chargerPerson,
      width: 80,
      dataIndex: 'chargerPerson'
    },

  ]

  return columns;
}



