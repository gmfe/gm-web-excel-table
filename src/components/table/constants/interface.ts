

export interface GMExcelTableColumnState {
  width?: number;
  // TOOD 增加string支持
  // 改了很多遍，不指定宽度可以100%填充
  height?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface ValueViewerArgs{
  value: any;
  col: number;
  row: number;
  cell: {
    value: any;
    key: string;
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    origin: GMExcelTableColumnState;
    valueViewer: typeValueViewer;
  }
}

export type typeValueViewer = (props: ValueViewerArgs) => (null | JSX.Element | string | number);

// https://github.com/nadbm/react-datasheet#cell-options
export interface GMExcelTableColumn extends GMExcelTableColumnState {
  key: string;
  fixColumn?: boolean;
  readOnly?: boolean;
  dataIndex?: string; // 指定数据字段
  sortable?: boolean; // 暂不可用
  resizeable?: boolean;
  disableEvents?: boolean; // 移除事件并且只读
  dataEditor?: ((props: any) => (null | JSX.Element));
  valueViewer?: typeValueViewer;
  Header?: string;
  components?: ((props: any) => (null | JSX.Element)); // Insert a react element or JSX to this field. This will render on edit mode
}

export interface GMExcelTableColumnWithOrigin extends GMExcelTableColumn {
  origin: GMExcelTableColumnState;
}