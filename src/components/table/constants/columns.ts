
export interface IColumn {
  readOnly?: boolean;
  disableEvents?: boolean;
  dataIndex?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  Header?: ((column: IColumn) => (null | string | JSX.Element)) | string;
  components?: ((props: any) => (null | JSX.Element)); // Insert a react element or JSX to this field. This will render on edit mode
  dataEditor?: ((props: any) => (null | JSX.Element));
  valueViewer?: ((props: any) => (null | JSX.Element));
  sortable?: boolean;
  resizeable?: boolean;
}

export enum GM_TABLE_COLUMNS_KEYS {
  date = 'date',
  type = 'type',
  note = 'note',
  amount = 'amount',
}

export interface IGM_TABLE_COLUMNS {
  [GM_TABLE_COLUMNS_KEYS.date]: IColumn;
  [GM_TABLE_COLUMNS_KEYS.amount]: IColumn;
  [GM_TABLE_COLUMNS_KEYS.type]: IColumn;
  [GM_TABLE_COLUMNS_KEYS.note]: IColumn;
}

export const GM_TABLE_COLUMNS: IGM_TABLE_COLUMNS = {
  [GM_TABLE_COLUMNS_KEYS.date]: {
    width: 200,
    minWidth: 100,
    dataIndex: GM_TABLE_COLUMNS_KEYS.date,
  },
  [GM_TABLE_COLUMNS_KEYS.amount]: {
    width: 100,
    dataIndex: GM_TABLE_COLUMNS_KEYS.amount,
  },
  [GM_TABLE_COLUMNS_KEYS.type]: {
    width: 100,
    dataIndex: GM_TABLE_COLUMNS_KEYS.type,
  },
  [GM_TABLE_COLUMNS_KEYS.note]: {
    width: 100,
    dataIndex: GM_TABLE_COLUMNS_KEYS.note,
  },
}