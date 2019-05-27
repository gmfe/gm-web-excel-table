



export enum DataManagerEvents {
  added = 'added',
  deleted = 'deleted',
  changed = 'changed',
}

export interface IDataManager<T> {
  getData: () => T[];
  setData: (data: T[]) => void;
  onDelete: (index: number) => void;
  onUpdate: (newItem: Object, rowIndex: number) => void;
  onAdd: (item: (T | undefined)[], rowIndex?: number, callback?: () => void) => void;
  addEventListener: (eventKeys: DataManagerEvents, listener: Function) => void;
  removeEventListener: (eventKeys: DataManagerEvents, listener: Function) => void;
}

export interface IDataManagerProvideProps<T> {
  data: any[];
  dataLoading: boolean;
  dataManager: IDataManager<T>;
}