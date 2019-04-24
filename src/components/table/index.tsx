
import './index.less'
import * as React from 'react';
import classnames from 'classnames'
import ColumnHeader from './columnheader';
import { IColumn } from './constants/columns';
import { WithDataManager } from './datamanager';
import { WithTableDataSearch } from './data-search';
import ExcelSheetBody from './components/sheet-body';
import { ROW_DRAGGER_WIDTH } from './constants/config';
import { WithTableController } from './tablecontroller';
import { GMExcelTableProps, CellSelectedState } from './interface';
import { enhanceWithFlows } from '../../core/utils/enhancewithflows';
import { WithColumnRowManager } from './columnrowmanager/with-column-row-manager';


interface GMConfigData<T>{
  fillBlankData: Object,
  initData: T[] // mocksDatas(20),
  fetchData: Promise<T>
}
interface GMTableExcelStaticConfig {
  tableKey: string;
  containerStyle: Object
  // columns={columns}
  widthRange?: { max?: number, min?: number }
  fullScreenWidth?: boolean, // 初始加载全屏 在这个模式下范围最小值默认为屏幕宽度
  searchConfig: {
    enable?: boolean;
    indexKey: string;
    searchKeys: string[]; //['date', 'type', 'note'],
    // searchRender: (props) // 暂时不提供对外开放的searchRenderer配置
  }
  columnsConfig: {
    // getCellDom: getCellDom, // NOTICE 这个应该不放在这层
    // TODO 补充props interface
    getColumns: (props: any) => IColumn[]
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
        args: { getColumns }
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
    return <DeliveryComponent {...this.props} />
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
    // const newData = {
    //   amount: 120,
    //   type: 'income',
    //   note: 'transfer',
    //   date: '2018-02-11',
    //   key: this.props.data.length,
    // };
    // this.props.dataManager.onAdd(newData);
  }
}


export class GMTableExcel extends React.Component<GMExcelTableProps, any> {

  static defaultProps = {
    canDragRow: true, // NOTICE 
  }

  // 如果指定100%填充
  private _tableWidth?: number;
  private _isColumnResizedDirty: boolean = false;

  constructor(props: GMExcelTableProps) {
    super(props);
  }

  componentDidMount() {
    this.props.tableRef(new TableRef(this));
  }

  // handleTableWidth() {
  //   if (this._isColumnResizedDirty) {
  //     const { columns } = this.props;
  //     let isAllAssignWidth = true;
  //     columns.forEach(col => {
  //       if (col.width === undefined) {
  //         isAllAssignWidth = false;
  //       }
  //     });


  //     this._tableWidth = columns.reduce((a, b) => a + b.width, 0) + ROW_DRAGGER_WIDTH; + 2
  //   }
  //   return this._tableWidth;
  // }


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




