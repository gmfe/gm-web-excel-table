

import * as React from 'react';
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

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {
      tableKey,
      controllerConfig,
      columnsConfig: { getColumns },
      searchConfig,
      dataConfig: { defaultData, initData, fetchData }
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
        args: {
          initData,
          fetchData,
          defaultData,
        }
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
