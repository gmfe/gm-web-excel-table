import * as moment from 'moment';
import * as React from 'react';
import { DatePicker } from 'antd';

import { IColumn, GM_TABLE_COLUMNS, GM_TABLE_COLUMNS_KEYS } from '../table/constants/columns';
import { IGetColumnsFunc } from '../table/columnrowmanager/constants';
import { IColumnManagerProps } from '../table/columnrowmanager/interface';


class DataPickerEditor extends React.Component<any> {
  render() {
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
          if (moment && dataIndex) {
            const string = moment.toISOString().slice(0, 10);
            dataManager.onUpdate({ [dataIndex]: string }, row)
          }
        }}
        onOpenChange={() => {
          console.log('onOpenChangeonOpenChange')
        }}
      />
    )
  }
}


export const configOrderTable1Columns: IGetColumnsFunc = (componentProps: IColumnManagerProps) => {
  const columns: IColumn[] = [
    {
      ...GM_TABLE_COLUMNS.date,
      minWidth: 150,
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
      key: 'action1',
      Header: 'action1',
      disableEvents: true,
      valueViewer: (data: any) => {
        return (
          <a href="javascript:;" onClick={() => {
            // console.log(data, 'datadatatatata,')
            componentProps.dataManager.onDelete(data.row);
          }}>Delete</a>
        );
      }
    },
    {
      key: 'action2',
      Header: 'action2',
      valueViewer: (data: any) => {
        return <span>action2</span>
      }
    }
  ];
  return columns;
}
