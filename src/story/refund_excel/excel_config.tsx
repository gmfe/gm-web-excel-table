import * as React from 'react';
import { GMExcelTableColumn, ConfigColumnProps, ValueViewerArgs } from '../../components';


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




export const configOrderTable1Columns = (componentProps: ConfigColumnProps) => {

  // 序号 | 商品名 | 商品分类 | 退货数 | 退货单价 | 补差 | 退货金额 | 退货批次 | 	操作人

  const columns: GMExcelTableColumn[] = [


    // 序号
    {
      Header: '序号',
      fixColumn: true,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.number,
      width: 49,
      valueViewer: (props: ValueViewerArgs) => {
        return props.row;
      }
    },


    // 操作
    {
      key: 'action',
      width: 113,
      fixColumn: true,
      disableEvents: true,
      // className: 'action',
      Header: '操作',
      valueViewer: (props: ValueViewerArgs) => {
        console.log(props, componentProps,  'action valueViewer propsprops')
        return (
          <div style={{ cursor: 'default'}}> 
            <a  style={{ cursor: 'pointer'}} onClick={() => {
              componentProps.dataManager.onAdd(undefined, props.row + 1);
            }}>添加</a>
            <a style={{ marginLeft: 5, cursor: 'pointer'}} onClick={() => {
              componentProps.dataManager.onDelete(props.row);
            }}>删除</a>
          </div>
        )
      }
    },

    // 商品名
    {
      Header: '商品名',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
      width: 250,
      dataIndex: 'orderName'
    },
  
    // 商品分类
    {
      Header: '商品分类',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderCategory,
      width: 80,
      dataIndex: 'category'
    },
    // 退货数
    {
      Header: '退货数',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
      width: 200,
      dataIndex: 'returnOrderNumber',
      dataEditor: (props: any) => {
        console.log(componentProps, props, 'componentProps')
        return <input onChange={e => {
          console.log(e.target.value, 'onChange')
        }}></input>
      }
    },
    // 退货单价
    {
      Header: '退货单价',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,
      width: 80,
      dataIndex: 'returnOrderPerPrice',
      // dataEditor: (props: any) => {
      //   console.log(componentProps, props, 'componentProps')
      //   return <input onChange={e => {
      //     console.log(e.target.value, 'onChange')
      //   }}></input>
      // }
    },
    // 补差
    {
      Header: '补差',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.fillPriceDiff,
      width: 80,
      dataIndex: 'fillPriceDiff'
    },
    // 退货金额
    {
      Header: '退货金额',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,
      width: 100,
      dataIndex: 'returnTotalPrice',
      dataEditor: (props: any) => {
        console.log(componentProps, props, 'componentProps')
        return <input onChange={e => {
          console.log(e.target.value, 'onChange')
        }}></input>
      }
    },

    // 退货批次
    {
      Header: '退货批次',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnBatchNumber,
      width: 100,
      dataIndex: 'returnBatchNumber',
      dataEditor: (props: any) => {
        console.log(componentProps, props, 'componentProps')
        return <input onChange={e => {
          console.log(e.target.value, 'onChange')
        }}></input>
      }
    },

    // 操作人
    {
      Header: '操作人',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.chargerPerson,
      width: 80,
      dataIndex: 'chargerPerson'
    },

  ]

  return columns;
}



