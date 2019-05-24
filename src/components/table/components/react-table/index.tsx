
import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css'
import './index.less'

import * as React from 'react';
import classnames from 'classnames'
import { GMTableExcelStaticConfig, _GM_TABLE_SCROLL_Y_CONTAINER_ } from "../../constants";
import { GMTableComponentProps } from './interface'
import { TweenOneGroup } from 'rc-tween-one';

import ReactTable, { TableProps } from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";
const ReactTableFixedColumns = withFixedColumns(ReactTable) as React.ComponentClass<Partial<TableProps<any, any>>, any>;


export class TableRef {
  public component: GMTableComponent;
  constructor(component: GMTableComponent) {
    this.component = component;
  }
  public get props() {
    return this.component.props;
  }
  addBlank = () => {
    this.props.dataManager.onAdd([this.props.dataConfig.defaultData]);
  }
  add = (item: any, rowIndex?: number) => {
    this.props.dataManager.onAdd([item], rowIndex);
  }
}

const AnimateBody = (props: any) => {
  return (
    <TweenOneGroup
      component="tbody"
      className="ant-table-tbody"
      enter={[
        { opacity: 0, y: -30, backgroundColor: '#fffeee', duration: 0 },
        { opacity: 1, y: 0, duration: 250, ease: 'linear' },
        { delay: 1000,  backgroundColor: '#fff', onEnd: () => {} },
      ]}
      leave={[
        { duration: 400, opacity: 0 },
        { height: 0, duration: 200, ease: 'easeOutQuad' },
      ]}
      appear={false}
      exclusive
    >
      {props.children}
    </TweenOneGroup>
  )
};


export class GMTableComponent extends React.Component<GMTableComponentProps<any> & GMTableExcelStaticConfig, any> {

  static defaultProps = {
    containerStyle: {}
  }

  constructor(props: GMTableComponentProps<any> & GMTableExcelStaticConfig) {
    super(props);
  }

  componentDidMount() {
    if (this.props.tableRef) {
      this.props.tableRef(new TableRef(this));
    }
  }

  tableDataWithProps = () => {
    const { data, tableController } = this.props;
    return data.map(d => ({ ...d,
      tableController,
    }));
  }

  // static dataMap2

  render() {
    const {
      tableKey,
      columns,
      className,
      containerStyle,
      tableConfig,
    } = this.props
    console.log(this.props, 'GMTableComponent')
    const dataWithProps = this.tableDataWithProps();
    return (
      <div
        style={containerStyle}
        id={`${_GM_TABLE_SCROLL_Y_CONTAINER_}${tableKey}`}
        className={classnames("gm-excel-table", className)}
      >
        <ReactTableFixedColumns
          {...tableConfig}
          data={dataWithProps} // The data prop should be immutable and only change when you want to update the table
          columns={columns}
          className="-striped -highlight"
          // resolveData `resolveData` runs when the `data` prop changes!
        />
      </div>
    )
  }
}
