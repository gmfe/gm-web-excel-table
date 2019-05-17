
import 'antd/lib/table/style/index.css';
import './index.less'
import * as React from 'react';
import classnames from 'classnames'
import { GMTableExcelStaticConfig, _GM_TABLE_SCROLL_Y_CONTAINER_ } from "../../constants";
import { GMExcelTableProps } from './interface'
import Table from 'antd/lib/table';
import { DataManagerEvents } from '../../datamanager/interface';
import { TweenOneGroup } from 'rc-tween-one';

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


export class GMTableExcel extends React.Component<GMExcelTableProps<any> & GMTableExcelStaticConfig, any> {

  static defaultProps = {
    containerStyle: {}
  }

  constructor(props: GMExcelTableProps<any> & GMTableExcelStaticConfig) {
    super(props);
  }

  componentDidMount() {
    if (this.props.tableRef) {
      this.props.tableRef(new TableRef(this));
    }

    // this.props.dataManager.addEventListener(DataManagerEvents.added, () => {
    //   console.log('data added');
    //   this.setState({ isPageTween: false });
    // });
    // this.props.dataManager.addEventListener(DataManagerEvents.deleted, () => {
    //   console.log('data deleted');
    //   this.setState({ isPageTween: false });
    // })

  }

  onClickCell = () => {

  }

  tableDataWithProps = () => {
    const { data, tableController } = this.props;
    return data.map(d => ({ ...d,
      tableController,
    }));
  }

  render() {
    const {
      tableKey,
      columns,
      className,
      containerStyle,
      tableConfig,
    } = this.props
    console.log(this.props, 'GMTableExcelGMTableExcel')
    const dataWithProps = this.tableDataWithProps();
    return (
      <div
        style={containerStyle}
        id={`${_GM_TABLE_SCROLL_Y_CONTAINER_}${tableKey}`}
        className={classnames("gm-excel-table", className)}
      >
        <Table
          columns={columns}
          dataSource={dataWithProps}
          {...tableConfig}
          rowKey={(d: any) => d.rowKey}
          components={{ body: { wrapper: AnimateBody } }}
        />
      </div>
    )
  }
}
