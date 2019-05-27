import { AppBase } from 'kunsam-app-model';
import { IColumnManager } from '../../columnrowmanager/interface';
import { IDataManagerProvideProps } from './../../datamanager/interface';
import { TableControllerInterface } from '../../tablecontroller/interface';


import { TableRef } from './index';
import { Column } from 'react-table';

export interface GMTableComponentProps<T> extends IDataManagerProvideProps<T> {
  app: AppBase;
  className?: string;
  containerStyle?: Object;
  columns: Column[];
  columnRowManager: IColumnManager;
  tableController: TableControllerInterface;
  tableRef?: (ref: TableRef) => void;
  onTableLoad?: (container: HTMLElement) => void;
}