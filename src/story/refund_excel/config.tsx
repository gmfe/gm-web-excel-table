
import { ColumnProps } from 'antd/lib/table';
import * as React from 'react';
import { Data_IRefundExcel } from './interface';
import { ConfigColumnProps, IGetColumnsFunc, IColumnManager } from '../../components/table/columnrowmanager/interface';


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



export const configOrderTable1Columns: IGetColumnsFunc = (componentProps: ConfigColumnProps<Data_IRefundExcel>, columnrowmanager: IColumnManager) => {

  // 序号 | 商品名 | 商品分类 | 退货数 | 退货单价 | 补差 | 退货金额 | 退货批次 | 	操作人

  const columns: ColumnProps<Data_IRefundExcel>[] = [

    // 序号
    {
      width: 49,
      title: '序号',
      fixed: 'left',
      dataIndex: 'number',
      defaultSortOrder: 'ascend',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.number,

      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return index;
      },

    },


    // 操作
    {
      key: 'action',
      width: 113,
      fixed: 'left',
      title: '操作',
      render: (props: any) => {
        console.log(props, componentProps,  'action valueViewer propsprops')
        return (
          <div>123</div>
          // <div style={{ cursor: 'default'}}> 
          //   <a  style={{ cursor: 'pointer'}} onClick={() => {
          //     componentProps.dataManager.onAdd(undefined, props.row + 1);
          //   }}>添加</a>
          //   <a style={{ marginLeft: 5, cursor: 'pointer'}} onClick={() => {
          //     componentProps.dataManager.onDelete(props.row);
          //   }}>删除</a>
          // </div>
        )
      }
    },

    // 商品名
    {
      title: '商品名',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
      width: 250,
      dataIndex: 'orderName',
      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return index;
      },

    },
  
    // 商品分类
    {
      title: '商品分类',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderCategory,
      width: 80,
      dataIndex: 'category'
    },
  
    // 退货数
    {
      title: '退货数',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
      width: 200,
      dataIndex: 'returnOrderNumber',
      render: (text: any, record: Data_IRefundExcel, index: number) => {
        return index;
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
        return index;
      },
      // d
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
        return index;
      },
      // dataEditor: (props: any) => {
      //   console.log(componentProps, props, 'componentProps')
      //   return <input onChange={e => {
      //     console.log(e.target.value, 'onChange')
      //   }}></input>
      // }
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



