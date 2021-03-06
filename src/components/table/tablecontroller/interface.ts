
export interface CellUniquePosition{
  col: number,
  row: number
}

export interface CellUniquePositionLinkedList {
  col: number
  row: number
  nextCol?: number
  nextRow?: number
  previousCol?: number
  previousRow?: number
}

export interface CellUniqueObject {
  columnKey: string;
  rowKey: string;
}

export enum MoveEditType {
  tab = 'tab',
  enter = 'enter',
  arrow = 'arrow',
}


export interface WithTableControllerConfig {
  // tableKey: string
  // columns: any[],
  noneInputClickValidList?: string[] // 非input点击有效列表 用于控制样式
  moveEdit: {
    // 允许多个移动逻辑
    [MoveEditType.arrow]?: TableControllerMoveEditAllowConfig
    [MoveEditType.tab]?: TableControllerMoveEditAllowConfig
    [MoveEditType.enter]?: TableControllerMoveEditAllowConfig
  }
}



export interface TableControllerMoveEditAllowConfig {

  allowUpAddRow?: boolean; // 允许向上增行
  allowDownAddRow?: boolean; // 允许向下增行

  // 若和增行同时开启则优先增加行
  allowBottom2Up?: boolean; // 允许最底行移动到最顶行
  allowUp2Bottom?: boolean; // 允许最顶行移动到最底行

  allowColumnRightBreakRow?: boolean; // 允许列最右换至下行
  allowColumnLeftBackRow?: boolean; // 允许列最左返回上行

  allowRightArrowDownAddRow?: boolean;

}

export type MoveEditingCellFunction = (type: MoveEditType, cell: CellUniqueObject, args?: any) => void;

export interface TableControllerInterface {
  edit: (obj: CellUniqueObject) => void;
  onEditStart: (obj: CellUniqueObject) => void;
  cancelEdit: (obj: CellUniqueObject) => void
  // select: () => void;
  // selectedCells: number;

  query: {
    isEditing: (obj: CellUniqueObject) => boolean;
    isCellOnFirstRow: (obj: CellUniqueObject) => boolean;
    isCellOnLastRow: (obj: CellUniqueObject) => boolean;
    getCellPosition: (obj:CellUniqueObject) => CellUniquePositionLinkedList | undefined;
    getCellData: (rowIndex: number, columnKey: string) => any;
  };

  move: {
    moveToNextEditableCell: MoveEditingCellFunction;
    moveToPreviousEditableCell: MoveEditingCellFunction;
    moveToNextRowEditableCell: MoveEditingCellFunction;
    moveToPreviousRowEditableCell: MoveEditingCellFunction;
  },

  register: {
    registerColumnAccessorMap: (columnKey: string, accessor: (row: number) => any) => void;
  }

}

export interface TableControllerProvideProps {
  onEditing: boolean;
  tableController: TableControllerInterface;
}


export interface TableControllerKeyboardHanlder {
  onKeyUp_ArrowRight: () => void;
  onKeyUp_ArrowLeft: () => void;
  onKeyUp_ArrowDown:  () => void;
  onKeyUp_ArrowUp: () => void;
  moveToNextEditableCell: (type: MoveEditType) => void;
}

export interface IScrollerInfo {
  row: { start: number, end: number },
  col: { start: number, end: number },
}