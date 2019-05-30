


import Big from 'big.js'
import * as React from 'react';
import { CellInfo } from 'react-table';
import SearchSelect from './components/cells/search-select';
import EditableInputNumber from './components/cells/editable-input-number';

import { SvgFun } from 'gm-svg'
import { ToolTip } from 'react-gm'
import SvgShanchumorenHuaban from 'gm-svg/src/ShanchumorenHuaban'
import SvgTianjiamorenHuaban from 'gm-svg/src/TianjiamorenHuaban'

import { GMOrderListDataStructure } from './interface';
import {
  IGetColumnsFunc,
  WithKeyboardHandler,
  GMExtendedColumnProps,
} from '../../components';




export enum GM_REFUND_TABLE_COLUMNS_KEYS {
  number = 'number', // 序号
  orderName = 'orderName', // 商品名
  orderCategory = 'orderCategory', // 商品分类
  returnOrderNumber = 'returnOrderNumber', // 退货数
  returnOrderPerPrice = 'returnOrderPerPrice', // 退货单价
  fillPriceDiff = 'fillPriceDiff', // 补差
  returnTotalPrice = 'returnTotalPrice', // 退货金额
  chargerPerson = 'chargerPerson',
}


const KeyBoardSearchSelect = WithKeyboardHandler(SearchSelect);
const KeyBoardEditableInputNumber = WithKeyboardHandler(EditableInputNumber);


/**
 * 业务实例 配置商品退货表格
 *
 * @param {*} componentProps
 * @returns
 */
export const configOrderTable1Columns: IGetColumnsFunc = (componentProps) => {

  // 序号 | 商品名 | 商品分类 | 退货数 | 退货单价 | 补差 | 退货金额 | 	操作人


  const RenderKeyBoardEditableInputNumber = (key: string, dataIndex: string, className?: string) => ({ original, value, viewIndex }: CellInfo) => {
    const cell = { columnKey: key, rowKey: original.rowKey };
    const isEditing = original.tableController.query.isEditing(cell);
    // const number = value && parseInt(value, 10) || null;
    return (
      <KeyBoardEditableInputNumber
        cell={cell}
        value={value}
        editing={isEditing}
        className={className}
        tableController={original.tableController}
        onChange={(value?: number) => {
          componentProps.dataManager.onUpdate({ [dataIndex]: value }, viewIndex, key);
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
      minWidth: 15,
      style: { borderRight: '1px solid rgba(0,0,0,0.02)' },
      Cell: ({ viewIndex }: CellInfo) => {
        return viewIndex + 1;
      }
    },


    // 操作
    {
      key: 'action',

      fixed: 'left',
      center: true,
      minWidth: 61,
      maxWidth: 82,
      style: { borderRight: '1px solid rgba(0,0,0,0.05)', boxShadow: '1px 0px 8px -8px' },
      Header: () => <SvgFun className={`${componentProps.tableKey}-svg ${componentProps.tableKey}-action-header-svg`} />,
      Cell: () => {
        return (
          [
            <ToolTip key="add" top popup={<span>添加</span>}>
              <span>
                <SvgTianjiamorenHuaban
                  width={18}
                  className={`${componentProps.tableKey}-svg ${componentProps.tableKey}-add-svg`}
                />
              </span>
            </ToolTip>
            ,

            <ToolTip key="delete" top popup={<span>删除</span>}>
              <span>
                <SvgShanchumorenHuaban
                  width={18}
                  className={`${componentProps.tableKey}-svg ${componentProps.tableKey}-delete-svg`}
                />
              </span>

            </ToolTip>
            ,

          ]
        )
      },
    },


    // 商品名
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
      minWidth: 173,
      editable: true,
      sortable: false,
      uniqueEditable: true,
      accessor: 'orderName',
      className: 'cell-orderName',

      Header: '商品名',
      Cell: ({ value, original, viewIndex }: CellInfo) => {
        const cellObj = {
          columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.orderName,
          rowKey: original.rowKey,
        };
        const isEditing = original.tableController.query.isEditing(cellObj);
        // this is an ensure props by refund-table;
        const { onSearchOrderName } = componentProps.custom;
        const dataValueMap = new Map()
        return (
          <KeyBoardSearchSelect
            cell={cellObj}
            value={value}
            editing={isEditing}
            tableController={original.tableController}
            onSearch={(value: string) => onSearchOrderName(value, viewIndex)}
            mapSearchDataToSelect={(data: GMOrderListDataStructure[][]) => {
              let rowData = data[viewIndex] || [];
              return rowData.map((d: GMOrderListDataStructure) => ({
                label: d.label,
                children: d.children.map(c => {
                  dataValueMap.set(c.value, c);
                  return { value: c.value, text: c.name }
                })
              }))
            }}
            onSelect={(data: { value: string, text: string }) => {
              if (data) {
                const selectedData = dataValueMap.get(data.value);
                componentProps.dataManager.onUpdate(selectedData, viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.orderName);
              }
            }}
          />
        )
      },

    },

    // 商品分类
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.orderCategory,

      minWidth: 32,
      Header: '商品分类',
      sortable: false,
      accessor: 'category',
    },

    // 退货数
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,

      Header: '退货数',
      minWidth: 120,
      editable: true,
      uniqueEditable: true,
      accessor: 'returnOrderNumber',
      registerAccessor: ((cell: CellInfo) => cell.value),
      Cell: RenderKeyBoardEditableInputNumber(
        GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,
        'quantity',
        'returnOrderNumber'
      ),
    },

    // 退货单价
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,

      minWidth: 126,
      Header: '退货单价',
      editable: true,
      uniqueEditable: true,
      accessor: 'returnOrderPerPrice',
      registerAccessor: ((cell: CellInfo) => cell.value),
      Cell: RenderKeyBoardEditableInputNumber(
        GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice,
        'unit_price',
        'returnOrderPerPrice'
      ),
    },

    // 补差
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.fillPriceDiff,

      Header: '补差',
      minWidth: 22,
      accessor: 'fillPriceDiff',
      Cell: (cell: CellInfo) => {
        return cell.value || '-';
      }
    },

    // 退货金额
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,

      Header: '退货金额',
      minWidth: 105,
      accessor: 'returnTotalPrice',
      Cell: ({ original: { rowKey, tableController }, viewIndex }: CellInfo) => {
        const returnOrderNumber = tableController.query.getCellData(viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber);
        const returnOrderPerPrice = tableController.query.getCellData(viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice);
        let value: any = 0
        if (returnOrderNumber && returnOrderPerPrice) {
          value = Big(returnOrderNumber).mul(Big(returnOrderPerPrice)).toFixed(2);
        }
        const cell = { columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice, rowKey: rowKey };
        const isEditing = tableController.query.isEditing(cell);
        const number = value && parseInt(value, 10) || null;
        return (
          <KeyBoardEditableInputNumber
            cell={cell}
            value={number}
            editing={isEditing}
            className={'returnTotalPrice'}
            tableController={tableController}
            onChange={(value?: number) => {
              componentProps.dataManager.onUpdate({ 'money': value }, viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice);
            }}
          />
        );
      }
    },

    // 操作人
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.chargerPerson,
      Header: '操作人',
      minWidth: 35,
      accessor: 'chargerPerson'
    },

  ]

  return columns
}



