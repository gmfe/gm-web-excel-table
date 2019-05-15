import './index.less'
import * as React from 'react';
import classnames from 'classnames'
import { GMTableExcelStaticConfig } from "../../constants";
import { GMExcelTableProps } from './interface'

import Table from 'antd/lib/table';
import 'antd/lib/table/style/index.css';

export class TableRef {
  public component: GMTableExcel;
  constructor(component: GMTableExcel) {
    this.component = component;
  }
  public get props() {
    return this.component.props;
  }
  addBlank = () => {
    console.log(this.props, 'handleAddhandleAdd')
    this.props.dataManager.onAdd(this.props.dataConfig.defaultData);
  }
  add = (item: any, rowIndex?: number) => {
    this.props.dataManager.onAdd(item, rowIndex);
  }
}



export class GMTableExcel extends React.Component<GMExcelTableProps<any> & GMTableExcelStaticConfig, any> {

  componentDidMount() {
    if (this.props.tableRef) {
      this.props.tableRef(new TableRef(this));
    }

  }

  render() {
    const {
      columns,
      className,
      containerStyle,
      columnRowManager,
    } = this.props
    console.log(this.props, 'GMTableExcelGMTableExcel')

    return (
      <div
        style={containerStyle}
        className={classnames("gm-excel-table", className)}
      >

        {/* <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />, */}

      </div>
    )
  }
}
