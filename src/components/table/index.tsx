
import './index.less'
import * as React from 'react';
import classnames from 'classnames'
import ColumnHeader from './columnheader';
import { WithDataManager } from './datamanager';
import { WithTableDataSearch } from './data-search';
import ExcelSheetBody from './components/sheet-body';
import { ROW_DRAGGER_WIDTH } from './constants/config';
import { WithTableController } from './tablecontroller';
import { IGetColumnsFunc } from './columnrowmanager/constants';
import { GMExcelTableProps, CellSelectedState } from './interface';
import { enhanceWithFlows } from '../../core/utils/enhancewithflows';
import { WithColumnRowManager } from './columnrowmanager/with-column-row-manager';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd';

interface GMConfigData<T> {
  fillBlankData: Object,
  initData: T[] // mocksDatas(20),
  fetchData: Promise<T>
}
interface GMTableExcelStaticConfig {
  tableKey: string;
  containerStyle: Object
  fullScreenWidth?: boolean, // 开启之后对于缺少指定width字段的cell补充满至全屏
  searchConfig: {
    enable?: boolean;
    indexKey: string;
    searchKeys: string[]; //['date', 'type', 'note'],
    // searchRender: (props) // 暂时不提供对外开放的searchRenderer配置
  }
  columnsConfig: {
    getColumns: IGetColumnsFunc
  }
  canDragRow?: boolean;
  dataConfig: GMConfigData<any>;
  tableRef: (tref: TableRef) => void;
}

export class GMTableExcelStaticConfigWrapper extends React.Component<GMTableExcelStaticConfig, any> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const {
      columnsConfig: { getColumns },
      searchConfig: { searchKeys, indexKey },
      dataConfig: { fillBlankData, initData, fetchData }
    } = this.props;
    const DeliveryComponent = enhanceWithFlows(GMTableExcel, [
      // 拓展搜索
      {
        enhance: WithTableDataSearch,
        args: { searchKeys, indexKey }
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
        <DeliveryComponent {...this.props} />
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

  // 如果指定100%填充
  private _tableWidth?: number;
  private _isColumnResizedDirty: boolean = false;

  constructor(props: GMExcelTableProps & GMTableExcelStaticConfig) {
    super(props);
  }

  componentDidMount() {
    this.props.tableRef(new TableRef(this));
  }

  render() {

    const {
      columns,
      containerStyle,
      className,
      tableWidth,
      canDragRow,
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




