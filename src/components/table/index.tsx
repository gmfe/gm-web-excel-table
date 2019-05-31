

import * as React from 'react';
import isEqual from 'lodash/isEqual'
import { WithDataManager } from './datamanager';
import { WithTableDataSearch } from './data-search';
import { WithTableController } from './tablecontroller';
import { GMTableExcelStaticConfig } from './constants/interface';
import { ClientAppModel, enhanceWithFlows } from 'kunsam-app-model';
import { WithColumnRowManager } from './columnrowmanager/with-column-row-manager';

// 表格原材料 react-table | react-datasheet | rc-table 均可
import { GMTableComponent } from './components/react-table';


// 装配出厂
export class GMTableExcelStaticConfigWrapper extends React.Component<GMTableExcelStaticConfig, any> {

  static defaultProps = {
    tableConfig: {
      pagination: false
    }
  }

  private _app: ClientAppModel;

  constructor(props: GMTableExcelStaticConfig) {
    super(props);
    if (!props.app) {
      this._app = new ClientAppModel();
    } else {
      this._app = props.app;
    }
  }
  componentDidMount() {
    this._app.run();
  }
  /**
   * 禁止任何重交付，除非交付条件发生变化(列配置改变等)
   *
   * @param {GMTableExcelStaticConfig} nextProps
   * @returns
   * @memberof GMTableExcelStaticConfigWrapper
   */

  shouldComponentUpdate(nextProps: GMTableExcelStaticConfig) {
    if (!isEqual(nextProps.columnsConfig.columnContext, this.props.columnsConfig.columnContext)) {
      return true
    }
    return false;
  }

  render() {
    const {
      dataConfig,
      searchConfig,
      controllerConfig,
      columnsConfig: { getColumns },
    } = this.props;

    const DeliveryComponent = enhanceWithFlows(GMTableComponent, [
      // 拓展搜索
      {
        enhance: WithTableDataSearch,
        args: searchConfig,
      },
      // 表格控制
      { enhance: WithTableController, args: controllerConfig },
      // 业务表格配置 行列管理
      {
        enhance: WithColumnRowManager,
        args: { getColumns },
      },
      // 数据管理
      {
        enhance: WithDataManager,
        args: { ...dataConfig }
      },
    ]);
    return (
      <DeliveryComponent
        app={this._app}
        {...this.props}
        tableConfig={{ ...GMTableExcelStaticConfigWrapper.defaultProps.tableConfig, ...this.props.tableConfig }}
      />
    )
  }
}
