



export enum DataManagerEvents {
  added = 'added',
  deleted = 'deleted',
  changed = 'changed',
}

export interface IDataManager<T> {
  getData: () => (T & { rowKey: string })[];
  onDelete: (index: number) => void;
  onUpdate: (newItem: Object, rowIndex: number, columnKey: string) => void;
  onAdd: (item: (T | undefined)[], rowIndex?: number, callback?: () => void) => void;
  addEventListener: (eventKeys: DataManagerEvents, listener: Function) => void;
  removeEventListener: (eventKeys: DataManagerEvents, listener: Function) => void;
}

export interface IDataManagerProvideProps<T> {
  data: any[];
  dataLoading: boolean;
  dataManager: IDataManager<T>;
}

export enum IDataManagerChangeType {
  addRow = 'addRow',
  deleteRow = 'deleteRow',
  updateCell = 'updateCell',
  updateAll = 'updateAll',
}