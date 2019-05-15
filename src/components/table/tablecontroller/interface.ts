


export interface WithTableControllerConfig {
  tableKey: string,
  // columns: any[],
}

export interface TableControllerInterface {
  edit: () => void,
  select: () => void;
  selectedCells: number;
}