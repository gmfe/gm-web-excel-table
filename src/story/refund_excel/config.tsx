
import { ColumnProps } from 'antd/lib/table';
import * as React from 'react';
import { Data_IRefundExcel, DataWithController_IRefundExcel } from './interface';



import { Header } from './components/header';
import SearchSelect from './components/cells/search-select';
import EditableInputNumber from './components/cells/editable-input-number';


import ActionSvg from '../../static/icon/action.svg'
import MinusSquareSvg from '../../static/icon/minus-square-default.svg';
import MinusSquareClickedSvg from '../../static/icon/minus-square-clicked.svg'
import PlusSquareSvg from '../../static/icon/plus-square-default.svg'
import PlusSquareClickedSvg from '../../static/icon/plus-square-clicked.svg'



// import { ConfigColumnProps, IGetColumnsFunc, IColumnManager, GMExtendedColumnProps } from '../../components/table/columnrowmanager/interface';
import {
  IColumnManager,
  IGetColumnsFunc,
  ConfigColumnProps,
  WithKeyboardHandler,
  GMExtendedColumnProps,
} from '../../components';
import HoverIcon from '../../components/hover-icon/hover-icon';

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


const KeyBoardSearchSelect = WithKeyboardHandler(SearchSelect);
const KeyBoardEditableInputNumber = WithKeyboardHandler(EditableInputNumber);


// 用于计算百分比占比的宽度列表
const WIDTH_LIST = [
  42,
  78, // 74
  194,
  66,
  148,
  163,
  55,
  149,
  107,
];
const TOTAL_WIDTH = WIDTH_LIST.reduce((a, b) => a + b, 0) / 100;


export const configOrderTable1Columns: IGetColumnsFunc = (componentProps: ConfigColumnProps<Data_IRefundExcel>, columnrowmanager: IColumnManager) => {

  // 序号 | 商品名 | 商品分类 | 退货数 | 退货单价 | 补差 | 退货金额 | 退货批次 | 	操作人

  const RenderKeyBoardEditableInputNumber = (key: string, dataIndex: string) => (text: any, record: DataWithController_IRefundExcel, index: number) => {
    const cell = { columnKey: key, rowKey: record.rowKey };
    const isEditing = record.tableController.query.isEditing(cell);
    const number = parseInt(text, 10);
    return (
      <KeyBoardEditableInputNumber
        cell={cell}
        value={number}
        editing={isEditing}
        tableController={record.tableController}
        onEdit={(value?: number) => {
          if (value) {
            componentProps.dataManager.onUpdate({ [dataIndex]: value }, index);
          }
        }}
      />
    );
  }

  const columns: GMExtendedColumnProps<DataWithController_IRefundExcel>[] = [

    // https://lanhuapp.com/web/#/item/project/board/detail?pid=40b095a1-691b-41c9-8f29-b091413ee1f3&project_id=40b095a1-691b-41c9-8f29-b091413ee1f3&image_id=4c5a7608-b56b-461f-bc28-50c3581d0184
    // 序号
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.number,
      fixed: 'left',
      title: '序号',
      // sortDirections: ['descend', 'ascend'],
      // defaultSortOrder: 'ascend',
      // sorter: (a: DataWithController_IRefundExcel, b: DataWithController_IRefundExcel) => {
      //   return a.index - b.index;
      // },
      minWidth: 15,
      render: (_: any, __: DataWithController_IRefundExcel, index: number) => {
        return index;
      },
    },


    // 操作
    {
      key: 'action',
      fixed: 'left',
      title: () => {
        return <div>操作</div>
      },
      minWidth: 61,
      maxWidth: 82,
      render: (_: any, __: any, index: number) => {
        return (
          <div>
            <div style={{ width: 12 }} dangerouslySetInnerHTML={{ __html: MinusSquareSvg }}></div>
            {/* <MinusSquareSvg width={59} /> */}
            {/* <HoverIcon
              onClick={() => {
                console.log('HoverIconHoverIcon')
              }}
              Placeholder = {MinusSquareSvg}
              Hover = {MinusSquareClickedSvg}
            /> */}

            <a style={{ cursor: 'pointer' }} onClick={() => {
              componentProps.dataManager.onAdd(undefined, index + 1);
            }}>添加</a>
            <a style={{ marginLeft: 5, cursor: 'pointer' }} onClick={() => {
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
      dataIndex: 'orderName',
      editable: true,
      uniqueEditable: true,
      minWidth: 173,
      render: (text: string, record: DataWithController_IRefundExcel, index: number) => {
        const cell = {
          columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
          rowKey: record.rowKey,
        };
        const isEditing = record.tableController.query.isEditing(cell);
        // console.log(isEditing, index, 'indexindexindex')
        return (
          <KeyBoardSearchSelect
            cell={cell}
            value={text}
            tableController={record.tableController}
            onSelect={(value: string) => {
              componentProps.dataManager.onUpdate({ orderName: value }, index);
            }}
          />
        )
      },

    },

    // 商品分类
    {
      title: '商品分类',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderCategory,
      dataIndex: 'category',
      minWidth: 32,
    },

    // 退货数
    {
      title: '退货数',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
      dataIndex: 'returnOrderNumber',
      minWidth: 120,
      editable: true,
      uniqueEditable: true,
      render: RenderKeyBoardEditableInputNumber(GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber, 'returnOrderNumber'),
    },

    // 退货单价
    {
      title: '退货单价',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,
      dataIndex: 'returnOrderPerPrice',
      editable: true,
      uniqueEditable: true,
      minWidth: 126,
      render: RenderKeyBoardEditableInputNumber(GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice, 'returnOrderPerPrice'),
    },

    // 补差
    {
      title: '补差',
      minWidth: 22,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.fillPriceDiff,
      dataIndex: 'fillPriceDiff'
    },

    // 退货金额
    {
      title: '退货金额',
      minWidth: 105,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,
      dataIndex: 'returnTotalPrice',

      // editable: true,
      // uniqueEditable: true,
      // render: RenderKeyBoardEditableInputNumber3,
    },

    // 退货批次
    // {
    //   title: '退货批次',
    //   key: GM_REFUND_TABLE_COLUMNS_KEYS.returnBatchNumber,
    //   width: 221 + 1,
    //   dataIndex: 'returnBatchNumber',
    // },

    // 操作人
    {
      title: '操作人',
      minWidth: 35,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.chargerPerson,
      dataIndex: 'chargerPerson'
    },

  ]



  return columns.map((c, i) => ({ ...c, width: c.fixed ? `${WIDTH_LIST[i] * (TOTAL_WIDTH * 100 / 1260) / TOTAL_WIDTH}vw` : undefined, cellWidth: `${WIDTH_LIST[i] * (TOTAL_WIDTH * 100 / 1260) / TOTAL_WIDTH}vw` }));
}



