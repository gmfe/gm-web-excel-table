


import Big from 'big.js'
import * as React from 'react';
import { CellInfo } from 'react-table';
import SearchSelect from './components/cells/search-select';
import EditableInputNumber from './components/cells/editable-input-number';

import { SvgFun } from 'gm-svg';
import { ToolTip, Trigger } from 'react-gm';
import SvgShanchumorenHuaban from 'gm-svg/src/ShanchumorenHuaban';
import SvgTianjiamorenHuaban from 'gm-svg/src/TianjiamorenHuaban';
import { GMOrderListDataStructure } from './interface';
import {
  IGetColumnsFunc,
  WithKeyboardHandler,
  GMExtendedColumnProps,
  ColumnRowManagerComponentProps,
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

  returnBatchNumber = 'returnBatchNumber' // 退货批次
}


const KeyBoardSearchSelect = WithKeyboardHandler(SearchSelect);
const KeyBoardEditableInputNumber = WithKeyboardHandler(EditableInputNumber);


/**
 * 业务实例 配置商品退货表格
 *
 * @param {*} componentProps
 * @returns
 */
export const configOrderTable1Columns: IGetColumnsFunc = (componentProps: ColumnRowManagerComponentProps) => {

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


  // Promise
  const i18next = componentProps.custom.i18next;

  const columns: GMExtendedColumnProps[] = [

    // https://lanhuapp.com/web/#/item/project/board/detail?pid=40b095a1-691b-41c9-8f29-b091413ee1f3&project_id=40b095a1-691b-41c9-8f29-b091413ee1f3&image_id=4c5a7608-b56b-461f-bc28-50c3581d0184
    // 序号
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.number,
      fixed: 'left',
      Header: i18next.t('序号'),
      minWidth: 24,
      maxWidth: 49,
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
      minWidth: 56,
      maxWidth: 82,
      style: { borderRight: '1px solid rgba(0,0,0,0.05)', },
      Header: () => <SvgFun className={`${componentProps.tableKey}-svg ${componentProps.tableKey}-action-header-svg`} />,
      Cell: ({ viewIndex }: CellInfo) => {
        return (
          [
            <ToolTip
              key="add" top popup={<span>添加</span>}>
              <span onClick={() => { componentProps.dataManager.onAdd([undefined], viewIndex + 1); }}>
                <SvgTianjiamorenHuaban
                  width={18}
                  className={`${componentProps.tableKey}-svg ${componentProps.tableKey}-add-svg`}
                />
              </span>
            </ToolTip>
            ,

            <ToolTip key="delete" top popup={<span>删除</span>}>
              <span onClick={() => { componentProps.dataManager.onDelete(viewIndex); }}>
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
      minWidth: 98,
      editable: true,
      sortable: false,
      uniqueEditable: true,
      accessor: 'orderName',
      className: 'cell-orderName',

      Header: i18next.t('商品名'),
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

      minWidth: 26,
      Header: i18next.t('商品分类'),
      sortable: false,
      accessor: 'category',
    },

    // 退货数
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber,

      Header: i18next.t('退货数'),
      minWidth: 100,
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

      minWidth: 100,
      Header: i18next.t('退货单价'),
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

      Header: i18next.t('补差'),
      minWidth: 28,
      accessor: 'fillPriceDiff',
      Cell: (cell: CellInfo) => {
        return cell.value || '-';
      }
    },

    // 退货金额
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,

      Header: i18next.t('退货金额'),
      minWidth: 100,
      editable: true,
      uniqueEditable: true,
      accessor: 'returnTotalPrice',
      Cell: RenderKeyBoardEditableInputNumber(
        GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice,
        'money',
        'returnTotalPrice'
      ),
      // Cell: ({ original: { rowKey, tableController }, viewIndex }: CellInfo) => {
      //   const returnOrderNumber = tableController.query.getCellData(viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderNumber);
      //   const returnOrderPerPrice = tableController.query.getCellData(viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.returnOrderPerPrice);
      //   let value: any = 0
      //   if (returnOrderNumber && returnOrderPerPrice) {
      //     value = Big(returnOrderNumber).mul(Big(returnOrderPerPrice)).toFixed(2);
      //   }
      //   const cell = { columnKey: GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice, rowKey: rowKey };
      //   const isEditing = tableController.query.isEditing(cell);
      //   const number = value && parseInt(value, 10) || null;
      //   return (
      //     <KeyBoardEditableInputNumber
      //       cell={cell}
      //       value={number}
      //       editing={isEditing}
      //       className={'returnTotalPrice'}
      //       tableController={tableController}
      //       onChange={(value?: number) => {
      //         componentProps.dataManager.onUpdate({ 'money': value }, viewIndex, GM_REFUND_TABLE_COLUMNS_KEYS.returnTotalPrice);
      //       }}
      //     />
      //   );
      // }
    },

    // 操作人
    {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.chargerPerson,
      Header: i18next.t('操作人'),
      minWidth: 29,
      accessor: 'chargerPerson'
    },

  ]

  // 动态权限 增加退货批次栏
  if (componentProps.columnsConfig.columnContext.isShowReturnBatchNumber) {
    columns.splice(6, 0, {
      key: GM_REFUND_TABLE_COLUMNS_KEYS.returnBatchNumber,
      Header: i18next.t('退货批次'),
      minWidth: 28,
      Cell: ({ original, viewIndex }: CellInfo) => {

        // 是否选择了批次
        const hasBatchSelected = !!(original.returnBatchNumner && original.returnBatchNumner.length)
        const selected_sum = original.hasEdit ? original.selected_sum : original.remain ? original.remain : 0
        const is_anomaly = original.returnOrderNumber && Big(original.returnOrderNumber).gt(selected_sum)

        let children = null;
        if (!hasBatchSelected) {
          children = i18next.t('选择批次')
        } else {
          if (!is_anomaly) {
            children = i18next.t('查看批次')
          } else {
            children = (
              <div className="gm-select-batch-anomaly">
                <span style={{ color: '#ff0000', textDecoration: 'underline', marginRight: '5px' }}>{i18next.t('查看批次')}</span>
                <Trigger
                  showArrow
                  component={<div />}
                  type='hover'
                  popup={
                    <div className='gm-padding-10 gm-bg' style={{ width: '200px', color: '#333' }}>
                      {i18next.t('所选批次库存数小于退货数，请更改批次或修改退货数')}
                    </div>
                  }>
                  <span style={{ backgroundColor: '#ff0000', color: '#ffffff', padding: '2px' }}>
                    {i18next.t('异常')}
                  </span>
                </Trigger>
              </div>
            )
          }
        }
        const { onClickSelectBatch } = componentProps.custom;
        return (
          <a href='javascript:;' className="-select-return-batch" onClick={() => {
            onClickSelectBatch(original, viewIndex)
          }}>{children}</a>
        )
      }
    })
  }


  return columns
}



