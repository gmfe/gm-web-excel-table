
export interface CellUniqueObject {
  columnKey: string;
  rowKey: string;
}

export interface WithTableControllerConfig {
  tableKey: string,
  // columns: any[],
}

export interface TableControllerInterface {
  edit: (obj: CellUniqueObject) => void,
  uniqueEdit: (obj: CellUniqueObject) => void,
  cancelEdit: (obj: CellUniqueObject) => void,


  select: () => void;
  selectedCells: number;
  query: {
    isEditing: (obj: CellUniqueObject) => boolean;
  }
}