
import './index.less'
import * as React from 'react';
import classnames from 'classnames'
import { AppBase } from '../../core/appbase';
import { App, SJAPP } from '../../client/app';
import { WithDataManager } from './datamanager';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd';
import { WithTableDataSearch } from './data-search';
import ExcelSheetBody from './components/sheet-body';
import ColumnHeader from './components/columnheader';
import { ROW_DRAGGER_WIDTH } from './constants/config';
import { WithTableController } from './tablecontroller';
import { IGetColumnsFunc } from './columnrowmanager/interface';
import { enhanceWithFlows } from '../../core/utils/enhancewithflows';
import { GMExcelTableProps, GMTableExcelStaticConfig } from './interface';
import { WithColumnRowManager } from './columnrowmanager/with-column-row-manager';




export class GMTableExcelStaticConfigWrapper extends React.Component<GMTableExcelStaticConfig, any> {
  private _app: AppBase = App;

  componentDidMount() {
    (this._app as SJAPP).run();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      columnsConfig: { getColumns },
      searchConfig,
      dataConfig: { fillBlankData, initData, fetchData }
    } = this.props;
    const DeliveryComponent = enhanceWithFlows(GMTableExcel, [
      // 拓展搜索
      {
        enhance: WithTableDataSearch,
        args: searchConfig,
      },
      // 表格控制
      { enhance: WithTableController, args: { tableKey: 'key' } },
      // 业务表格配置 行列管理
      {
        enhance: WithColumnRowManager,
        args: { getColumns },
      },
      // 数据管理
      {
        enhance: WithDataManager,
        args: {
          initData,
          fetchData,
          fillBlankData,
        }
      },
    ]);
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <DeliveryComponent {...this.props} app={this._app} />
      </DragDropContextProvider>
    )
  }
}

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
    this.props.dataManager.onAdd(this.props.dataConfig.fillBlankData);
  }
  add = (item: any, rowIndex?: number) => {
    this.props.dataManager.onAdd(item, rowIndex);
  }
}


export class GMTableExcel extends React.Component<GMExcelTableProps & GMTableExcelStaticConfig, any> {

  static defaultProps = {
    canDragRow: true, // NOTICE 
  }

  // constructor(props: GMExcelTableProps & GMTableExcelStaticConfig) {
  //   super(props);
  // }

  componentDidMount() {
    this.props.tableRef(new TableRef(this));
  }

  render() {
    const {
      columns,
      className,
      tableWidth,
      canDragRow,
      containerStyle,
      columnRowManager,
    } = this.props
    console.log(this.props, tableWidth, 'GMTableExcelGMTableExcel')
    return (
      <div
        style={containerStyle}
        className={classnames("gm-excel-table", className)}
      >
        <div style={tableWidth ? { width: tableWidth } : {}}>
          <ColumnHeader
            columns={columns}
            onResizeStart={columnRowManager.onResizeColumnStart}
            onResizeColumn={columnRowManager.onResizeColumn}
            containerStyle={canDragRow ? { paddingLeft: ROW_DRAGGER_WIDTH } : {}}
          />
          <ExcelSheetBody
            {...this.props}
            tableWidth={tableWidth}
          />
        </div>
      </div>
    )
  }
}



