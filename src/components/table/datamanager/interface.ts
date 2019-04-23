



export interface WithDataManagerProps<T, K> {
  initData: T[]
  defaultData: K
  fetchData: Promise<T>
}


export enum DataManagerEvents {
  added = 'added',
  deleted = 'deleted',
  changed = 'changed',
}