import { TableRef } from './index';
import { Column } from 'react-table';
import { AppBase } from 'kunsam-app-model';
import { IColumnManager } from '../../columnrowmanager/interface';
import { GMTableExcelStaticConfig } from './../../constants/interface';
import { IDataManagerProvideProps } from './../../datamanager/interface';
import { TableControllerProvideProps } from '../../tablecontroller/interface';

export interface GMTableComponentBaiscProps {
  app: AppBase;
  columns: Column[];
  className?: string;
  containerStyle?: Object;
  columnRowManager: IColumnManager;
  tableRef?: (ref: TableRef) => void;
  onTableLoad?: (container: HTMLElement) => void;
}


export type GMTableComponentProps = GMTableComponentBaiscProps & TableControllerProvideProps & IDataManagerProvideProps<any> & GMTableExcelStaticConfig;