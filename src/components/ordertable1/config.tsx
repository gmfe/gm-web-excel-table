import * as React from 'react';
import * as moment from 'moment';
import { DatePicker } from 'antd';
import { GM_TABLE_COLUMNS_KEYS, IGM_TABLE_COLUMNS } from './interface';
import { GMExcelTableColumn } from '../table/constants/interface';
import { IColumnManagerProps } from '../table/columnrowmanager/interface';
import { render } from 'react-dom';

import { Select } from 'antd';
import { SearchRenderProps } from '../table/interface';
const Option = Select.Option;

const GM_TABLE_COLUMNS: IGM_TABLE_COLUMNS = {
  [GM_TABLE_COLUMNS_KEYS.date]: {
    width: 150,
    minWidth: 100,
    key: GM_TABLE_COLUMNS_KEYS.date,
  },
  [GM_TABLE_COLUMNS_KEYS.amount]: {
    width: 100,
    key: GM_TABLE_COLUMNS_KEYS.amount,
  },
  [GM_TABLE_COLUMNS_KEYS.type]: {
    width: 100,
    key: GM_TABLE_COLUMNS_KEYS.type,
  },
  [GM_TABLE_COLUMNS_KEYS.note]: {
    width: 100,
    key: GM_TABLE_COLUMNS_KEYS.note,
  },
}


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


export const configOrderTable1Columns = (componentProps: IColumnManagerProps) => {
  const columns: GMExcelTableColumn[] = [
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


export class SearchRenderer extends React.Component<SearchRenderProps> {

  render () {
    const { searchResults, searchValue, onSearch, onSelect, onReset } = this.props;
    const options = searchResults.map((d: any, index: number) => (
      <Option key={`${d.key}-${d.rowIndex}-${d.colIndex}`} value={`${d.key}-${d.rowIndex}-${d.colIndex}`} >
        <div onClick={() => {
          // console.log(this.props, 'indexindexonClickonClickindexindexindex')
          // this.props.tableController.select(RowcolIndextoSelectedState(d.rowIndex, d.colIndex));
        }}>{`${d.value} - 第${d.rowIndex}行第${d.colIndex}列`}</div>
      </Option>
    ));
    return (
      <Select
        showSearch
        showArrow={false}
        value={searchValue}
        placeholder={"搜索内容"}
        filterOption={false}
        notFoundContent={null}
        style={{ width: '90%' }}
        defaultActiveFirstOption={false}
        onSearch={onSearch}
        onChange={(key: string) => {
          const values = key.split('-');
          if (values.length >= 3) {
            const rowIndex = parseInt(values[1]);
            const colIndex = parseInt(values[2]);
            onSelect(rowIndex, colIndex);
          }
        }}
        onFocus={() => { onReset() }}
        // onSelect={(...args: any) => { console.log(args, 'onSelect') }}
        // onInputKeyDown={(e: any) => { console.log(e.target, 'onInputKeyDown') }}
      >
        {options}
      </Select>
    )
  }
}
