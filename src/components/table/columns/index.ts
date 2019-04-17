import { Column } from "react-table";


/*
[{
  // Renderers - For more information, see "Renderers" section below
  Cell: JSX | String | Function // Used to render a standard cell, defaults to the accessed value
  Header: JSX | String | Function // Used to render the header of a column or column group
  Footer: JSX | String | Function // Used to render the footer of a column
  Filter: JSX | cellInfo => ( // Used to render the filter UI of a filter-enabled column
    <select onChange={event => onFiltersChange(event.target.value)} value={filter ? filter.value : ''}></select>
    // The value passed to onFiltersChange will be the value passed to filter.value of the filterMethod
  )
  Aggregated: JSX | String | Function // Used to render aggregated cells. Defaults to a comma separated list of values.
  Pivot: JSX | String | Function | cellInfo => ( // Used to render a pivoted cell
    <span>
      <Expander /><PivotValue /> // By default, will utilize the the PivotValue and Expander components at run time
    </span>
  ),
  PivotValue: JSX | String | Function // Used to render the value inside of a Pivot cell
  Expander: JSX | String | Function // Used to render the expander in both Pivot and Expander cells

  // General
  accessor: 'propertyName', // or Accessor eg. (row) => row.propertyName (see "Accessors" section for more details)
  id: 'myProperty', // Conditional - A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
  sortable: boolean, // Overrides the table option
  resizable: boolean, // Overrides the table option
  filterable: boolean, // Overrides the table option
  show: true, // can be used to hide a column
  width: undefined, // A hardcoded width for the column. This overrides both min and max width options
  minWidth: 100, // A minimum width for this column. If there is extra room, column will flex to fill available space (up to the max-width, if set)
  maxWidth: undefined, // A maximum width for this column.

  // Special
  pivot: false,
  // Turns this column into a special column for specifying pivot position in your column definitions.
  // The `pivotDefaults` options will be applied on top of this column's options.
  // It will also let you specify rendering of the header (and header group if this special column is placed in the `columns` option of another column)
  expander: false,
  // Turns this column into a special column for specifying expander position and options in your column definitions.
  // The `expanderDefaults` options will be applied on top of this column's options.
  // It will also let you specify rendering of the header (and header group if this special column is placed in the `columns` option of another column) and
  // the rendering of the expander itself via the `Expander` property

  // Cell Options
  className: '', // Set the classname of the `td` element of the column
  style: {}, // Set the style of the `td` element of the column
  // Header & HeaderGroup Options
  headerClassName: '', // Set the classname of the `th` element of the column
  headerStyle: {}, // Set the style of the `th` element of the column
  getHeaderProps: (state, rowInfo, column, instance) => ({}), // a function that returns props to decorate the `th` element of the column

  // Header Groups only
  columns: [...], // See Header Groups section below

  // Footer
  footerClassName: '', // Set the classname of the `td` element of the column's footer
  footerStyle: {}, // Set the style of the `td` element of the column's footer
  getFooterProps: (state, rowInfo, column, instance) => ({}), // A function that returns props to decorate the `td` element of the column's footer

  // Filtering
  filterMethod: (filter, row || rows, column) => {return true}, // A function returning a boolean that specifies the filtering logic for the column
    // 'filter' == an object specifying which filter is being applied. Format: {id: [the filter column's id], value: [the value the user typed in the filter field], pivotId: [if filtering on a pivot column, the pivotId will be set to the pivot column's id and the `id` field will be set to the top level pivoting column]}
    // 'row' || 'rows' == the row (or rows, if filterAll is set to true) of data supplied to the table
    // 'column' == the column that the filter is on
  filterAll: false
}]
*/

export enum GM_TABLE_COLUMNS_KEYS {
  date = 'date',
  amount = 'amount',
  type = 'type',
  note = 'note',
}

export interface IGM_TABLE_COLUMNS {
  [GM_TABLE_COLUMNS_KEYS.date]: Column;
  [GM_TABLE_COLUMNS_KEYS.amount]: Column;
  [GM_TABLE_COLUMNS_KEYS.type]: Column;
  [GM_TABLE_COLUMNS_KEYS.note]: Column;
}

export const GM_TABLE_COLUMNS: IGM_TABLE_COLUMNS = {
  [GM_TABLE_COLUMNS_KEYS.date]: {
    width: 200,
    minWidth: 100,
    // title: 'Date',
    // dataIndex: 'date',
    accessor: GM_TABLE_COLUMNS_KEYS.date,
    pivot: true,
  },
  [GM_TABLE_COLUMNS_KEYS.amount]: {
    width: 100,
    // editable: true,
    // title: 'Amount',
    // dataIndex: 'amount',
    accessor: GM_TABLE_COLUMNS_KEYS.amount,
  },
  [GM_TABLE_COLUMNS_KEYS.type]: {
    width: 100,
    // title: 'Type',
    // dataIndex: 'type',
    accessor: GM_TABLE_COLUMNS_KEYS.type,
  },
  [GM_TABLE_COLUMNS_KEYS.note]: {
    width: 100,
    // title: 'Note',
    // dataIndex: 'note',
    accessor: GM_TABLE_COLUMNS_KEYS.note,
  },
  // action: {
  //   title: 'Action',
  //   key: 'action',
  // }
}