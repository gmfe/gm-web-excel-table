import { TableRef } from './index';
import { ColumnProps } from 'antd/lib/table'
import { AppBase } from 'kunsam-app-model';
import { IDataManager } from '../../datamanager/interface';
import { IColumnManager } from '../../columnrowmanager/interface';
import { TableControllerInterface } from '../../tablecontroller/interface';

export interface GMExcelTableProps<T> {
  data: T[];
  app: AppBase;
  className?: string;
  containerStyle?: Object;
  columns: ColumnProps<T>[];
  dataManager: IDataManager<T>;
  columnRowManager: IColumnManager;
  tableController: TableControllerInterface;

  tableRef?: (ref: TableRef) => void;
  onTableLoad?: (container: HTMLElement) => void;
}