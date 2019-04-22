import * as moment from 'moment';
import * as React from 'react';
import { DatePicker } from 'antd';

import { IColumn, GM_TABLE_COLUMNS, GM_TABLE_COLUMNS_KEYS } from '../table/constants/columns';


class DataPickerEditor extends React.Component<any> {
  render() {
    // console.log(this.props.cell, 'onUpdate')
    const date = moment(this.props.cell.value);
    return (
      <DatePicker
        value={date}
        getCalendarContainer={(t: any) => {
          const div = document.createElement('div');
          document.body.appendChild(div);
          div.onmousedown = (e: any) => { e.stopPropagation(); }
          return div;
        }}
        onChange={(moment: moment.Moment) => {
          const { cell: { dataIndex }, dataManager, row }: any = this.props;
          if (dataIndex) {
            const string = moment.toISOString().slice(0, 10);
            dataManager.onUpdate({ [dataIndex]: string }, row)
          }
        }}
      />
    )
  }
}


export const configOrderTable1Columns = (componentProps: any, columnRowManager: any) => {
  const columns: IColumn[] = [
    {
      ...GM_TABLE_COLUMNS.date,
      minWidth: 150,
      maxWidth: 600,
      Header: '日期',
      dataIndex: GM_TABLE_COLUMNS_KEYS.date,
      dataEditor: (props: any) => {
        return <DataPickerEditor {...componentProps} {...props} />
      }
    },
    {
      ...GM_TABLE_COLUMNS.amount,
      Header: '数量',
      dataIndex: GM_TABLE_COLUMNS_KEYS.amount,
    },
    {
      ...GM_TABLE_COLUMNS.type,
      Header: '类型',
      sortable: false,
      dataIndex: GM_TABLE_COLUMNS_KEYS.type,
    },
    {
      ...GM_TABLE_COLUMNS.note,
      Header: '文本',
      sortable: false,
      dataIndex: GM_TABLE_COLUMNS_KEYS.note,
    },
    {
      // width: 200,
      key: 'action',
      Header: 'action',
      disableEvents: true,
      valueViewer: (data: any) => {
        // console.log(data, 'valueViewer action')
        return (
          <a href="javascript:;" onClick={() => {
            componentProps.dataManager.onDelete(data.index);
          }}>Delete</a>
        );
      }
    }
  ];
  return columns;
}

export function getCellDom(tableContainerDom: HTMLElement, rowIndex: number, columnIndex: number): HTMLElement | undefined {
  const tbody = tableContainerDom.children[0].children[0].children[0];
  const tr = tbody.children[rowIndex];
  if (tr) {
    const cell = tr.children[columnIndex];
    return cell as HTMLElement;
  }
  return undefined;
}