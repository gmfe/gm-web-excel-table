
import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css'
import './index.less'

import * as React from 'react';
import classnames from 'classnames'
import { GMTableComponentProps } from './interface'
import ReactTable, { TableProps } from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";
import { _GM_TABLE_SCROLL_Y_CONTAINER_ } from "../../constants";


const ReactTableFixedColumns = withFixedColumns(ReactTable) as React.ComponentClass<Partial<TableProps<any, any>>, any>;

/**
 * 对外暴露的操作子
 *
 * @export
 * @class TableRef
 */
export class TableRef {
  public component: GMTableComponent;
  constructor(component: GMTableComponent) {
    this.component = component;
  }
  public get props() {
    return this.component.props;
  }
  addBlank = () => {
    this.props.dataManager.onAdd([
      this.props.dataConfig.defaultData
    ]);
  }
  add = (item: any, rowIndex?: number) => {
    this.props.dataManager.onAdd([item], rowIndex);
  }
}




export class GMTableComponent extends React.Component<GMTableComponentProps,any> {

  static defaultProps = {
    containerStyle: {}
  }

  constructor(props: GMTableComponentProps) {
    super(props);
  }

  componentDidMount() {
    if (this.props.tableRef) {
      this.props.tableRef(new TableRef(this));
    }
  }

  tableDataWithProps = () => {
    const { data, tableController } = this.props;
    return data.map(d => ({ ...d, tableController }));
  }

  render() {
    const {
      data,
      columns,
      tableKey,
      className,
      onEditing,
      tableConfig,
      dataLoading,
      containerStyle,
    } = this.props

    const dataWithProps = this.tableDataWithProps();
    return (
      <div
        style={containerStyle}
        id={`${_GM_TABLE_SCROLL_Y_CONTAINER_}${tableKey}`}
        className={classnames("gm-excel-table", className, {
          '-onEditing': onEditing,
        })}
      >
        <ReactTableFixedColumns
          {...tableConfig}
          pageSize={Math.max(1, data.length)}
          loading={dataLoading}
          data={dataWithProps} // The data prop should be immutable and only change when you want to update the table
          columns={columns}
          className={classnames({ '-highlight': !onEditing })}
        // resolveData `resolveData` runs when the `data` prop changes!
        />
      </div>
    )
  }
}
