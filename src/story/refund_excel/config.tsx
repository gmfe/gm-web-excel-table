

import * as React from 'react';
import { Data_IRefundExcel } from './interface';

import SearchSelect from './components/cells/search-select';
import EditableInputNumber from './components/cells/editable-input-number';


import ActionSvg from '../../static/icon/action.svg'
import MinusSquareSvg from '../../static/icon/minus-square-default.svg';
import MinusSquareClickedSvg from '../../static/icon/minus-square-clicked.svg'
import PlusSquareSvg from '../../static/icon/plus-square-default.svg'
import PlusSquareClickedSvg from '../../static/icon/plus-square-clicked.svg'


import {
  IGetColumnsFunc,
  WithKeyboardHandler,
  GMExtendedColumnProps,
} from '../../components';
import HoverIcon from '../../components/hover-icon/hover-icon';
import { CellInfo } from 'react-table';


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


const KeyBoardSearchSelect = WithKeyboardHandler(SearchSelect);
const KeyBoardEditableInputNumber = WithKeyboardHandler(EditableInputNumber);


// 用于计算百分比占比的宽度列表
// const WIDTH_LIST = [
//   42,
//   78, // 74
//   194,
//   66,
//   148,
//   163,
//   55,
//   149,
//   107,
// ];
// const TOTAL_WIDTH = WIDTH_LIST.reduce((a, b) => a + b, 0) / 100;


export const configOrderTable1Columns: IGetColumnsFunc = (componentProps) => {

  // 序号 | 商品名 | 商品分类 | 退货数 | 退货单价 | 补差 | 退货金额 | 退货批次 | 	操作人

  const RenderKeyBoardEditableInputNumber = (key: string, dataIndex: string, className?: string) => ({ original, value, viewIndex }: CellInfo) => {
    const cell = { columnKey: key, rowKey: original.rowKey };
    const isEditing = original.tableController.query.isEditing(cell);
    const number = parseInt(value, 10);
    return (
      <KeyBoardEditableInputNumber
        cell={cell}
        value={number}
        editing={isEditing}
        className={className}
        tableController={original.tableController}
        onChange={(value?: number) => {
          if (value) {
            componentProps.dataManager.onUpdate({ [dataIndex]: value }, viewIndex);
          }
        }}
      />
    );
  }

  const columns: GMExtendedColumnProps[] = [

    // https://lanhuapp.com/web/#/item/project/board/detail?pid=40b095a1-691b-41c9-8f29-b091413ee1f3&project_id=40b095a1-691b-41c9-8f29-b091413ee1f3&image_id=4c5a7608-b56b-461f-bc28-50c3581d0184
    // 序号
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.number,
      fixed: 'left',
      Header: '序号',
      // sortDirections: ['descend', 'ascend'],
      // defaultSortOrder: 'ascend',
      // sorter: (a: DataWithController_IRefundExcel, b: DataWithController_IRefundExcel) => {
      //   return a.index - b.index;
      // },
      minWidth: 15,
      Cell: ({ viewIndex, original }: CellInfo) => {
        return viewIndex;
      }
    },


    // 操作
    {
      key: 'action',
      fixed: 'left',
      Header: () => {
        return <div style={{ width: 14, display: 'inline-block', margin: 'auto' }} dangerouslySetInnerHTML={{ __html: ActionSvg }} />
      },
      minWidth: 61,
      maxWidth: 82,
      Cell: ({ viewIndex }: CellInfo) => {
        return (
          [
            <HoverIcon
              onClick={() => {
                componentProps.dataManager.onAdd([undefined], viewIndex + 1);
              }}
              key="plus"
              style={{ marginRight: 18 }}
              Placeholder={() => <div style={{ width: 18, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: PlusSquareSvg }} />}
              Hover={() => <div style={{ width: 18, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: PlusSquareClickedSvg }} />}
            />,

            <HoverIcon
              onClick={() => {
                componentProps.dataManager.onDelete(viewIndex);
              }}
              key="minus"
              Placeholder={() => <div style={{ width: 18, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: MinusSquareSvg }} />}
              Hover={() => <div style={{ width: 18, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: MinusSquareClickedSvg }} />}
            />,
          ]
        )
      },
    },


    // 商品名
    {
      Header: '商品名',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
      accessor: 'orderName',
      editable: true,
      uniqueEditable: true,
      minWidth: 173,
      className: 'cell-orderName',
      sortable: false,
      Cell: ({ value, original, viewIndex }: CellInfo) => {
        const cellObj = {
          columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
          rowKey: original.rowKey,
        };
        const isEditing = original.tableController.query.isEditing(cellObj);
        // this is an ensure props by refund-table;
        const { onSearchOrderName } = componentProps.custom;
        return (
          <KeyBoardSearchSelect
            cell={cellObj}
            value={value}
            editing={isEditing}
            onSearch={onSearchOrderName}
            tableController={original.tableController}
            onSelect={(value: string) => {
              componentProps.dataManager.onUpdate({ orderName: value }, viewIndex);
            }}
          />
        )
      },

    },

    // 商品分类
    {
      Header: '商品分类',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderCategory,
      accessor: 'category',
      minWidth: 32,
      sortable: false,
    },

    // 退货数
    {
      Header: '退货数',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
      accessor: 'returnOrderNumber',
      minWidth: 120,
      editable: true,
      uniqueEditable: true,
      Cell: RenderKeyBoardEditableInputNumber(
        GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
        'returnOrderNumber',
        'returnOrderNumber'
      ),
    },

    // 退货单价
    {
      Header: '退货单价',
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,
      accessor: 'returnOrderPerPrice',
      editable: true,
      uniqueEditable: true,
      minWidth: 126,
      Cell: RenderKeyBoardEditableInputNumber(
        GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,
        'returnOrderPerPrice',
        'returnOrderPerPrice'
      ),
    },

    // 补差
    {
      Header: '补差',
      minWidth: 22,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.fillPriceDiff,
      accessor: 'fillPriceDiff'
    },

    // 退货金额
    {
      Header: '退货金额',
      minWidth: 105,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,
      accessor: 'returnTotalPrice',

      // TODO 关联列值
      // Cell: ({ value, original, viewIndex }: CellInfo, column: any) => {

      // }
    },

    // 操作人
    {
      Header: '操作人',
      minWidth: 35,
      key: GM_REFUND_TABLE_COLUMNS_KEYS.chargerPerson,
      accessor: 'chargerPerson'
    },

  ]

  // return columns.map((c, i) => ({ ...c, width: c.fixed ? `${WIDTH_LIST[i] * (TOTAL_WIDTH * 100 / 1260) / TOTAL_WIDTH}vw` : undefined, cellWidth: `${WIDTH_LIST[i] * (TOTAL_WIDTH * 100 / 1260) / TOTAL_WIDTH}vw` }));
  return columns
}



