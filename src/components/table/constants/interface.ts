

export interface GMExcelTableColumnState {
  width?: number;
  // TOOD 增加string支持
  // 改了很多遍，不指定宽度可以100%填充
  height?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface GMExcelTableColumn extends GMExcelTableColumnState {
  key: string;
  readOnly?: boolean;
  dataIndex?: string;
  sortable?: boolean;
  resizeable?: boolean;
  disableEvents?: boolean;
  dataEditor?: ((props: any) => (null | JSX.Element));
  valueViewer?: ((props: any) => (null | JSX.Element));
  Header?: ((column: GMExcelTableColumn) => (null | string | JSX.Element)) | string;
  components?: ((props: any) => (null | JSX.Element)); // Insert a react element or JSX to this field. This will render on edit mode
}

export interface GMExcelTableColumnWithOrigin extends GMExcelTableColumn {
  origin: GMExcelTableColumnState;
}