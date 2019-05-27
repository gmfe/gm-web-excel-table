import * as React from 'react'

import {
  MoveEditType,
  IScrollerInfo,
  CellUniqueObject,
  CellUniquePosition,
  TableControllerInterface,
  WithTableControllerConfig,
  CellUniquePositionLinkedList,
  TableControllerMoveEditAllowConfig,
} from './interface';

import isEqual from 'lodash/isEqual'
import { IDataManager } from '../datamanager/interface';
import { GMExtendedColumnProps } from '../columnrowmanager/interface';
import { _GM_TABLE_SCROLL_Y_CONTAINER_, _GM_TABLE_SCROLL_CELL_PREFIX_ } from '../constants';


export * from './with-keyboard-handler';
export * from './tabelcontroller-util';

/**
 * 单元格控制器 tableConroller 高阶注入函数
 *
 * @export
 * @param {React.ComponentClass<any, any>} Target
 * @returns
 */
export function WithTableController(Target: React.ComponentClass<any, any>) {

  return (TABLE_CONFIG: WithTableControllerConfig) => {
    return class extends React.Component<{
      [key: string]: any
      data: any[]
      tableKey: string
      dataManager: IDataManager<any>
      columns: GMExtendedColumnProps[]
    }, {
      [key: string]: any,
      editingToggle: boolean,
    }>  {

      // 编辑状态表
      private _editingMap: Map<string, boolean>;

      // 位置查询表
      private _cellIdQueryPositionMap: Map<string, CellUniquePositionLinkedList>;

      // 位置查询id表
      private _cellPositionQueryIdMap: Map<string, CellUniqueObject>;

      // 一些数据缓存
      private _firstCell?: CellUniqueObject;
      private _lastCell?: CellUniqueObject;
      private _editingCell?: CellUniqueObject;
      private _cacheEditableCellMarixUpdateIndex?: any;
      private _scrollerInfo: IScrollerInfo = {
        row: { start: 0, end: 0 },
        col: { start: 0, end: 0 },
      }

      public get tableController(): TableControllerInterface {
        return {
          edit: this.edit.bind(this),
          cancelEdit: this.cancelEdit,
          onEditStart: this.edit.bind(this),
          query: {
            isEditing: (obj: CellUniqueObject) => { return this._editingMap.has(this.CellUniqueObject2Id(obj)) },
            isCellOnFirstRow: this.isCellOnFirstRow,
            isCellOnLastRow: this.isCellOnLastRow,
            getCellPosition: this.getCellPosition.bind(this),
          },
          move: {
            moveToNextEditableCell: this.moveToNextEditableCell,
            moveToPreviousEditableCell: this.moveToPreviousEditableCell,
            moveToNextRowEditableCell: this.moveToNextRowEditableCell,
            moveToPreviousRowEditableCell: this.moveToPreviousRowEditableCell,
          }
        }
      }
      /**
       * 定义滚动容器对象
       *
       * @returns
       */
      getScroller() {
        let xScroller: HTMLElement | null = null;
        if (document) {
          xScroller = document.querySelector(`#${_GM_TABLE_SCROLL_Y_CONTAINER_}${this.props.tableKey} .ReactTable .rt-table`);
        }
        return {
          xScroller,
          yScroller: xScroller //document.getElementById(`${_GM_TABLE_SCROLL_Y_CONTAINER_}${this.props.tableKey}`)
        }
      }

      __logCell = (cell: CellUniqueObject, text: string) => {
        const position = this.getCellPosition(cell);
        if (position) {
          // console.log(`[tablerController-log] ${position.row}行${position.col}列 ${text}`);
        }
      }

      constructor(props: any) {
        super(props);
        this.state = {
          tableActive: true, // 由这层控制，以满足多编辑竞争的需求
          selected: null,
          editingToggle: false,
          focusing: undefined // [ 0, 0 ]
        };
        this._editingMap = new Map();
        this._cellIdQueryPositionMap = new Map();
        this._cellPositionQueryIdMap = new Map();
      }

      componentDidMount() {
        // 注册快捷键
        window.document.addEventListener('keydown', this.handlePressTab);
        // 更新矩阵数据
        this.updateTableCellMatrix();
        this._cacheEditableCellMarixUpdateIndex = this.editableCellMarixUpdateIndex(this.props.columns, this.props.data);
      }

      handlePressTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const cell = this._editingCell || this.getCellByPosition(0, 0);
          if (cell) {
            this.moveToNextEditableCell(MoveEditType.tab, cell);
          }
        }
      }

      componentWillUnmount() {
        window.document.removeEventListener('keydown', this.handlePressTab);
      }

      componentDidUpdate() {
        // 其它表格激活后 卸载此事件钩子
        const { columns, data } = this.props;
        const editableCellMarixUpdateIndex = this.editableCellMarixUpdateIndex(columns, data);
        if (!isEqual(this._cacheEditableCellMarixUpdateIndex, editableCellMarixUpdateIndex)) {
          this._cacheEditableCellMarixUpdateIndex = editableCellMarixUpdateIndex;
          this.updateTableCellMatrix();
        }
      }

      // id函数
      public CellUniqueObject2Id(obj: CellUniqueObject) { return `${obj.columnKey}-${obj.rowKey}` }
      public PositionId(pos: CellUniquePosition) { return `${pos.col}-${pos.row}` }

      /**
       * 查询单元格坐标
       *
       * @param {CellUniqueObject} cell
       * @returns {(CellUniquePositionLinkedList | undefined)}
       */
      public getCellPosition(cell: CellUniqueObject): CellUniquePositionLinkedList | undefined {
        return this._cellIdQueryPositionMap.get(this.CellUniqueObject2Id(cell));
      }
      /**
       * 坐标查询单元格
       *
       * @param {number} nextCol
       * @param {number} nextRow
       * @returns {(CellUniqueObject | undefined)}
       */
      public getCellByPosition(nextCol: number, nextRow: number): CellUniqueObject | undefined {
        const nextCell = this._cellPositionQueryIdMap.get(this.PositionId({
          col: nextCol,
          row: nextRow,
        }));
        return nextCell;
      }
      /**
       * 查询单元格是否在第一列
       *
       */
      isCellOnFirstRow = (cell: CellUniqueObject) => {
        const position = this._cellIdQueryPositionMap.get(this.CellUniqueObject2Id(cell));
        if (position) {
          return position.row === 0;
        }
        return false
      }
      /**
       * 查询单元格是否在最后一列
       *
       */
      isCellOnLastRow = (cell: CellUniqueObject) => {
        const position = this._cellIdQueryPositionMap.get(this.CellUniqueObject2Id(cell));
        if (position) {
          return position.row === this.props.data.length - 1;
        }
        return false;
      }

      /**
       * 可编辑单元格映射对象，用于作为是否更新可编辑态矩阵的索引
       *
       * @param {GMExtendedColumnProps[]} columns
       * @param {any[]} data
       * @returns
       */
      public editableCellMarixUpdateIndex(columns: GMExtendedColumnProps[], data: any[]) {
        let ed_columns: GMExtendedColumnProps[] = [];
        columns.forEach((c, index) => {
          if (c.editable) {
            ed_columns.push({ key: `${c.key}-${index}` });
          }
        });
        return {
          columns: ed_columns,
          data: data.map((d, index) => ({ key: `${d.rowKey}-${index}` }))
        }
      }

      updateTableCellMatrix() {
        this._firstCell = undefined;
        this._lastCell = undefined;
        this._cellIdQueryPositionMap.clear();
        this._cellPositionQueryIdMap.clear();

        let previousPosition: CellUniquePositionLinkedList | undefined;;
        let previousCell: CellUniqueObject | undefined;

        // 默认 不能出现中间存在固定的列
        let firstNoneFixCol = false;

        this._scrollerInfo.row = {
          start: 0, end: this.props.data.length - 1,
        }
        this.props.data.forEach((row, rowIndex) => {
          if (!row.rowKey) return;
          this.props.columns.forEach((col, colIndex) => {
            if (!col.fixed) {
              if (!firstNoneFixCol) {
                firstNoneFixCol = true;
                this._scrollerInfo.col.start = colIndex;
              }
              this._scrollerInfo.col.end = colIndex;
            }

            if (!col.editable) return;
            if (!col.key) return;
            const columnKey = `${col.key}`;
            const rowKey = row.rowKey;
            const cell = { columnKey, rowKey };
            let position: CellUniquePositionLinkedList = {
              col: colIndex,
              row: rowIndex,
              previousRow: previousPosition && previousPosition.row,
              previousCol: previousPosition && previousPosition.col,
            };
            if (previousPosition && previousCell) {
              this._cellIdQueryPositionMap.set(this.CellUniqueObject2Id(previousCell), Object.assign(previousPosition, {
                nextCol: colIndex,
                nextRow: rowIndex,
              }));
            }
            this._cellIdQueryPositionMap.set(this.CellUniqueObject2Id(cell), position);
            this._cellPositionQueryIdMap.set(this.PositionId(position), cell);
            previousPosition = position;
            previousCell = cell;
            if (!this._firstCell) {
              this._firstCell = cell;
            }
            this._lastCell = cell;
          });
        });
        // console.log('表格行列数据更新!', this._cellIdQueryPositionMap);
      }

      // onEditStart (obj: CellUniqueObject, isUniqueEdit: boolean = true) {
      //   // 初始化
      //   this.__logCell(obj, 'onEditStart');
      //   if (isUniqueEdit) {
      //     this._editingMap.clear();
      //   }
      //   const itemId = this.CellUniqueObject2Id(obj);
      //   this._editingCell = obj;
      //   this._editingMap.set(itemId, true);
      // }

      edit(obj: CellUniqueObject, isUniqueEdit: boolean = true, callback: Function = () => { }) {
        const itemId = this.CellUniqueObject2Id(obj);
        if (this._editingMap.has(itemId)) {
          return;
        }
        if (isUniqueEdit) {
          this._editingMap.clear();
        }
        this._editingCell = obj;
        this._editingMap.set(itemId, true);
        this.setState({ editingToggle: !this.state.editingToggle }, () => { callback() });
        this.__logCell(obj, isUniqueEdit ? '进入唯一编辑状态' : '进入编辑状态');
      }

      cancelEdit = (obj: CellUniqueObject) => {
        // this.__logCell(obj, '取消编辑状态');
        const itemId = this.CellUniqueObject2Id(obj);
        if (this._editingMap.has(itemId)) {
          this._editingMap.delete(itemId);
          this._editingCell = undefined;
          this.setState({ editingToggle: !this.state.editingToggle });
        }
      }


      /**
       * 滚动到单元格
       *
       */
      scroll2Cell = (obj: CellUniqueObject, scrollY: boolean = false) => {
        const position = this._cellIdQueryPositionMap.get(this.CellUniqueObject2Id(obj));
        // NOTICE 可能会是动态宽高，所以每次取
        if (position) {
          let leftReduceWidth = 0;
          for (let i = this._scrollerInfo.col.start; i < position.col; i++) {
            const column = this.props.columns[i];
            const cell = document.getElementById(`${_GM_TABLE_SCROLL_CELL_PREFIX_}${column.key}${obj.rowKey}`);
            if (cell) {
              leftReduceWidth += cell.clientWidth;
            }
          }
          const scroller = this.getScroller();
          if (scroller.xScroller) {
            scroller.xScroller.scrollTo(leftReduceWidth, scroller.yScroller && scroller.yScroller.scrollTop || 0);
          }
          if (scrollY) {
            let topReduceHeight = 0;
            for (let i = this._scrollerInfo.row.start; i <= position.row; i++) {
              const row = this.props.data[i];
              const cell = document.getElementById(`${_GM_TABLE_SCROLL_CELL_PREFIX_}${obj.columnKey}${row.rowKey}`);
              if (cell && cell.parentElement) {
                topReduceHeight += cell.parentElement.clientHeight;
              }
            }
            // console.log(topsReduceHeight, scroller.yScroller, scroller.yScroller && scroller.yScroller.scrollTop, position, 'topReduceWidth 1111')
            // 目前看Y会自动滚动
            if (scroller.yScroller) {
              scroller.yScroller.scrollTo(scroller.xScroller && scroller.xScroller.scrollLeft || 0, topReduceHeight - 50 < 0 ? 0 : topReduceHeight - 50 );
            }
          }
          if (position.row === 0) {
            if (scroller.yScroller) {
              scroller.yScroller.scrollTo(scroller.xScroller && scroller.xScroller.scrollLeft || 0, 0);
            }
          }

        }
      }

      /**
       * 移动到上一行可编辑单元格
       *
       */
      moveToPreviousRowEditableCell = (type: MoveEditType, cell: CellUniqueObject) => {
        const config: TableControllerMoveEditAllowConfig | undefined = TABLE_CONFIG.moveEdit[type];
        if (!config) return;
        const currentEditingCellkey = this.CellUniqueObject2Id(cell);
        const currentPositionOfCell = this._cellIdQueryPositionMap.get(currentEditingCellkey);
        if (!currentPositionOfCell) return;
        let nextCol = currentPositionOfCell.col;
        let nextRow = currentPositionOfCell.row - 1;
        if (nextRow < 0) {
          // 向上增加一行
          if (config.allowUpAddRow) {
            this.props.dataManager.onAdd([undefined], 0, () => {
              if (this._firstCell) {
                this.edit(this._firstCell, true, () => this.scroll2Cell(this._firstCell!, true));
              }
            });
          }
        } else {
          const nextCell = this.getCellByPosition(nextCol, nextRow);
          if (nextCell) {
            this.scroll2Cell(nextCell);
            this.edit(nextCell);
          }
        }
      };
      /**
       * 移动到下一行可编辑单元格
       *
       */
      moveToNextRowEditableCell = (type: MoveEditType, cell: CellUniqueObject) => {
        const config: TableControllerMoveEditAllowConfig | undefined = TABLE_CONFIG.moveEdit[type];
        if (!config) return;
        const currentEditingCellkey = this.CellUniqueObject2Id(cell);
        const currentPositionOfCell = this._cellIdQueryPositionMap.get(currentEditingCellkey);
        if (!currentPositionOfCell) return;
        const rowMax = this.props.data.length;
        let nextRow = currentPositionOfCell.row + 1;
        if (nextRow >= rowMax) {
          // 向下增加五行
          if (config.allowDownAddRow) {
            this.props.dataManager.onAdd(new Array(5).fill(undefined), rowMax, () => {
              const cell = this._cellPositionQueryIdMap.get(this.PositionId({ col: currentPositionOfCell.col, row: rowMax }));
              if (cell) {
                this.edit(cell, true, () => this.scroll2Cell(cell, true));
              }
            });
          }
        } else {
          const nextCell = this.getCellByPosition(currentPositionOfCell.col, nextRow);
          if (nextCell) {
            this.scroll2Cell(nextCell);
            this.edit(nextCell);
          }
        }
      };

      /**
       * 移动至上一个可编辑单元格
       *
       */
      moveToPreviousEditableCell = (type: MoveEditType, cell: CellUniqueObject) => {
        const config: TableControllerMoveEditAllowConfig | undefined = TABLE_CONFIG.moveEdit[type];
        if (!config) return;
        const currentEditingCellkey = this.CellUniqueObject2Id(cell);
        const currentPositionOfCell = this._cellIdQueryPositionMap.get(currentEditingCellkey);
        if (!currentPositionOfCell) return;
        let nextCol = currentPositionOfCell.previousCol;
        let nextRow = currentPositionOfCell.previousRow;
        // console.log(currentPositionOfCell, config, type, 'moveToPreviousEditableCell')
        if (!(nextCol !== undefined && nextRow !== undefined)) {
          // 第一个可编辑单元格
          if (config.allowUp2Bottom) {
            if (this._lastCell) {
              this.edit(this._lastCell, true, () => this.scroll2Cell(this._lastCell!));
            }
          }
        } else {
          const nextCell = this.getCellByPosition(nextCol, nextRow);
          if (nextCell) {
            if (currentPositionOfCell.row === nextRow + 1) {
              if (config.allowColumnLeftBackRow) {
                this.edit(nextCell, true, () => this.scroll2Cell(nextCell));
              }
            }
            if (currentPositionOfCell.row === nextRow) {
              // 要先滚动，这样弹出的下拉框才会位置正确
              this.scroll2Cell(nextCell)
              this.edit(nextCell, true);
            }
          }
        }
      };

      /**
       * 移动至下一个可编辑单元格
       *
       */
      moveToNextEditableCell = (type: MoveEditType, cell: CellUniqueObject) => {
        const config: TableControllerMoveEditAllowConfig | undefined = TABLE_CONFIG.moveEdit[type];
        if (!config) return;
        const currentEditingCellkey = this.CellUniqueObject2Id(cell);
        const currentPositionOfCell = this._cellIdQueryPositionMap.get(currentEditingCellkey);
        if (!currentPositionOfCell) return;
        const rowMax = this.props.data.length;
        let nextCol = currentPositionOfCell.nextCol;
        let nextRow = currentPositionOfCell.nextRow;
        // console.log(type, config, 'moveToNextEditableCell config')
        if (!(nextCol !== undefined && nextRow !== undefined)) {
          // 某一个不存在，最后一个可编辑单元格
          if (config.allowDownAddRow) {
            // 向下增加五行
            this.props.dataManager.onAdd(new Array(5).fill(undefined), rowMax, () => {
              if (this._lastCell) {
                const position = this._cellIdQueryPositionMap.get(this.CellUniqueObject2Id(this._lastCell));
                if (position) {
                  const lastRowFisrtCell = this.getCellByPosition(0, position.row);
                  lastRowFisrtCell && this.edit(lastRowFisrtCell, true, () => this.scroll2Cell(lastRowFisrtCell));
                }
              }
            });
          } else {
            if (config.allowBottom2Up) {
              if (this._firstCell) {
                // 回滚至第一行
                this.scroll2Cell(this._firstCell)
                this.edit(this._firstCell);
              }
            }
          }
        } else {
          const nextCell = this.getCellByPosition(nextCol, nextRow);
          // console.log(currentPositionOfCell, nextCell, 'moveToNextEditableCell  currentPositionOfCell nextCell')
          if (nextCell) {
            if (currentPositionOfCell.row === nextRow - 1) {
              // 右方换行
              if (config.allowColumnRightBreakRow) {
                this.scroll2Cell(nextCell);
                this.edit(nextCell);
              }
            }
            if (currentPositionOfCell.row === nextRow) {
              this.scroll2Cell(nextCell);
              this.edit(nextCell);
            }
          }
        }

      }

      render() {
        return (
          <Target
            tableController={this.tableController}
            {...this.props}
          />
        )
      }

    }
  }
}

