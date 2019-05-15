


// Be sure to include styles at some point, probably during your bootstrapping
// import 'react-datasheet/lib/react-datasheet.css';
import './index.less'
import * as React from 'react';
import ReactDataSheet from 'react-datasheet';
import { CellSelectedState } from '../../interface';
import { rowDragSource, rowDropTarget } from '../../../../third-js/drag-drop.js'


const ROW_DRAGGER_WIDTH = 20;
const RowRenderer = rowDropTarget(rowDragSource((props: any) => {
  const { isOver, disable, children, canDragRow, connectDropTarget, connectDragPreview, connectDragSource } = props;
  console.log(canDragRow, 'canDragRowcanDragRow')

  if (!canDragRow) {
    return (<tr>{children}</tr>);
  }
  const className = isOver ? 'drop-target' : ''
  return connectDropTarget(connectDragPreview(
    <tr className={className}>
      {disable ? null :
        connectDragSource(
          <td className='read-only row-handler' key='$$actionCell' style={{ width: ROW_DRAGGER_WIDTH - 1 }} />
        )}
      {children}
    </tr>
  ))
}));




export default class ExcelSheetBody extends React.Component<any, any> {

  private _container?: HTMLElement;

  handleRowDrop = (from: any, to: any) => {
    const data = [...this.props.data]
    data.splice(to, 0, ...data.splice(from, 1));
    this.props.dataManager.setData(data);
  }

  renderRow = (props: any) => {
    const { row, cells, ...rest } = props
    return <RowRenderer canDragRow={this.props.canDragRow} rowIndex={row} onRowDrop={this.handleRowDrop} {...rest} />
  }

  renderDataEditor = (props: any) => {
    const { dataManager } = this.props;
    return (<input ref={c => {
      if (c) c.focus();
    }} style={{ margin: 0, width: '100%', height: '100%' }} onChange={function (e) {
      if (props.cell.dataIndex) {
        dataManager.onUpdate({ [props.cell.dataIndex]: e.target.value }, props.row)
      }
    }} />);
  }

  handleOnContextMenu = (event: MouseEvent, cell: any, i: any, j: any) => {
    event.preventDefault();
    console.log(cell, i, j, 'handleOnContextMenu')
    // can show a menu 
  }

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.columnsMapData.length !== this.props.columnsMapData.length) {
      return true;
    }
    return true;
  }


  componentDidMount() {
    // need to listen cell length change dirty for
    // console.log(this._container, this._container && this._container.clientWidth, '_container')
    if (this._container) {
      const { onTableLoad } = this.props;
      onTableLoad && onTableLoad(this._container)
    }

  }


  render() {
    // TODO 静态样式配置拆出去
    const {
      columns,
      tableWidth,
      columnsMapData,
      tableController,
    } = this.props;

    console.log(columns, 'columnscolumns')
    const csyle: any = { height: 200, overflowY: 'scroll', overflowX: 'hidden' }
    if (tableWidth !== undefined) {
      csyle.width = tableWidth;
    }

    const fixData = columnsMapData.map((col: any) => col.slice(0, 2));
    const nofixData = columnsMapData.map((col: any) => col.slice(2));


    return (
      <div ref={(c: any) => { this._container = c }} style={csyle}>

        {/* https://github.com/nadbm/react-datasheet#cell-renderer */}
        <ReactDataSheet
          overflow="nowrap"
          data={fixData}
          valueRenderer={(cell: any) => cell.value}
          onCellsChanged={(changes: any) => {
            console.log(changes, 'onCellsChanged')
          }}
          className={"gm-react-data-sheet"}
          sheetRenderer={props => {
            console.log(props, 'gm-react-data-sheet')
            return (
              <div style={{ position: 'relative' }}>
                <table cellSpacing={0} className={props.className + ' my-awesome-extra-class'}>
                  <thead>
                    <tr>
                      {columns.map((col: any) => (<th>{col.Header}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {props.children}
                  </tbody>
                </table>
              </div>
            )
          }}
          // cellRenderer={(props: any) => {
          //   const { cell, style, selected, className } = props;
          //   console.log(props, 'classNameclassNameclassName')
          //   return <td style={{ ...style, display: 'inline-block' }} className={className}>{cell.value}</td>
          // }}
          selected={tableController.selectedCells}
          rowRenderer={this.renderRow}
          onSelect={(select: CellSelectedState) => {
            tableController.select(select);
            console.log(select, 'onSelect')
          }}
          dataEditor={this.renderDataEditor}
          parsePaste={(string: string) => {
            console.log(string, 'parsePaste')
            return [];
          }}
          onContextMenu={this.handleOnContextMenu}
        />

        <ReactDataSheet
          overflow="nowrap"
          data={nofixData}
          valueRenderer={(cell: any) => cell.value}
          onCellsChanged={(changes: any) => {
            console.log(changes, 'onCellsChanged')
          }}
          sheetRenderer={props => {
            console.log(props, 'gm-react-data-sheet')
            return (
              <div style={{ position: 'relative' }}>
                <table cellSpacing={0} className={props.className + ' my-awesome-extra-class'}>
                  <thead>
                    <tr>
                      {columns.map((col: any) => (<th>{col.Header}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {props.children}
                  </tbody>
                </table>
              </div>
            )
          }}
          className={"gm-react-data-sheet"}
          selected={tableController.selectedCells}
          rowRenderer={this.renderRow}
          onSelect={(select: CellSelectedState) => {
            tableController.select(select);
            console.log(select, 'onSelect')
          }}
          dataEditor={this.renderDataEditor}
          parsePaste={(string: string) => {
            console.log(string, 'parsePaste')
            return [];
          }}
          onContextMenu={this.handleOnContextMenu}
        />

      </div>
    )
  }
}

