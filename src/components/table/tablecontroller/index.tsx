import * as React from 'react'

import {
  CellUniqueObject,
  CellUniquePosition,
  TableControllerInterface,
  WithTableControllerConfig,
  CellUniquePositionLinkedList,
  TableControllerMoveEditAllowConfig,
  MoveEditType,
} from './interface';

import { KeyboardEventContext, AppBase } from 'kunsam-app-model';
import { GMExtendedColumnProps } from '../columnrowmanager/interface';

import isEqual from 'lodash/isEqual'
import { IDataManager } from '../datamanager/interface';




export function WithTableController(Target: React.ComponentClass<any, any>) {

  return (TABLE_CONFIG: WithTableControllerConfig) => {
    return class extends React.Component<{
      [key: string]: any,
      data: any[],
      dataManager: IDataManager<any>,
      columns: GMExtendedColumnProps<any>[]
    }, {
      [key: string]: any,
      editingToggle: boolean,
    }>  {
      // columnKey
      private _editingMap: Map<string, boolean>;

      private _cellIdQueryPositionMap: Map<string, CellUniquePositionLinkedList>;
      private _firstCell?: CellUniqueObject;
      private _lastCell?: CellUniqueObject;

      private _cellPositionQueryIdMap: Map<string, CellUniqueObject>;
      private _cacheEditableCellMarixUpdateIndex?: any;
      // private _refMap: Map<string, HTMLElement>;
      // private _sizeMap: Map<string, { width: number, height: number }>;

      public get tableController(): TableControllerInterface {
        return {
          selectedCells: this.state.selected,
          select: this.select.bind(this),
          edit: this.edit.bind(this),
          cancelEdit: this.cancelEdit,
          query: {
            isEditing: (obj: CellUniqueObject) => { return this._editingMap.has(this.CellUniqueObject2Id(obj)) },
            isCellOnFirstRow: this.isCellOnFirstRow,
            isCellOnLastRow: this.isCellOnLastRow,
          },
          move: {
            moveToNextEditableCell: this.moveToNextEditableCell,
            moveToPreviousEditableCell: this.moveToPreviousEditableCell,
            moveToNextRowEditableCell: this.moveToNextRowEditableCell,
            moveToPreviousRowEditableCell: this.moveToPreviousRowEditableCell,
          }
        }
      }

      constructor(props: any) {
        super(props);
        this.state = {
          tableActive: true,
          // 由这层控制，以满足多编辑竞争的需求
          editingToggle: false,
          selected: null,
          following: {
            // rowColumnPosition: [0, 0],
            // ref: undefined,
            stylePosition: { top: 0, left: 0 },
          },
          // following: undefined, // [0, 0] // 框
          focusing: undefined // [ 0, 0 ]
        };
        // 做一个查找树
        // this._sizeMap = new Map();
        // this._refMap = new Map();
        this._editingMap = new Map();
        this._cellIdQueryPositionMap = new Map();
        this._cellPositionQueryIdMap = new Map();

        // 注册按键移动事件
        // 注册快捷键
      }

      public CellUniqueObject2Id(obj: CellUniqueObject) { return `${obj.columnKey}-${obj.rowKey}` }
      public PositionId(pos: CellUniquePosition) { return `${pos.col}-${pos.row}` }

      public getCell(nextCol: number, nextRow: number): CellUniqueObject | undefined {
        const nextCell = this._cellPositionQueryIdMap.get(this.PositionId({
          col: nextCol,
          row: nextRow,
        }));
        return nextCell;
      }

      isCellOnFirstRow = (cell: CellUniqueObject) => {
        const position = this._cellIdQueryPositionMap.get(this.CellUniqueObject2Id(cell));
        if (position) {
          return position.row === 0;
        }
        return false
      }

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
       * @param {GMExtendedColumnProps<any>[]} columns
       * @param {any[]} data
       * @returns
       */
      public editableCellMarixUpdateIndex(columns: GMExtendedColumnProps<any>[], data: any[]) {
        let ed_columns: GMExtendedColumnProps<any>[] = [];
        columns.forEach((c, index) => {
          if (c.editable) ed_columns.push({ key: `${c.key}-${index}` });
        });
        return {
          columns: ed_columns,
          data: data.map((d, index) => ({ key: `${d.rowKey}-${index}` }))
        }
      }

      componentDidMount() {
        const app: AppBase = this.props.app;
        app.eventManager().keyboardEvents().listenKeyDown((context: KeyboardEventContext) => {
          console.log(context, 'contextcontextcontext')
        });
        this.updateTableCellMatrix();
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

      updateTableCellMatrix() {
        this._firstCell = undefined;
        this._lastCell = undefined;
        this._cellIdQueryPositionMap.clear();
        this._cellPositionQueryIdMap.clear();

        let nextPosition: CellUniquePositionLinkedList | undefined;
        let previousPosition: CellUniquePositionLinkedList | undefined;;

        let nextCell: CellUniqueObject | undefined;
        let previousCell: CellUniqueObject | undefined;

        this.props.data.forEach((row, rowIndex) => {
          if (!row.rowKey) return;

          this.props.columns.forEach((col, colIndex) => {
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
        })
      }

      init() {
        // 表格初始化 多个表格同时存在的时候 需要进行切换
      }

      select = () => {
        // this.setState({ selected: state });
        // TODO 还需要增加 XY方向上的滚动定位
      }

      edit(obj: CellUniqueObject, isUniqueEdit: boolean = true) {
        const itemId = this.CellUniqueObject2Id(obj);
        if (this._editingMap.get(itemId)) {
          return;
        }
        if (isUniqueEdit) {
          this._editingMap.clear();
        }
        this._editingMap.set(itemId, true);
        this.setState({ editingToggle: !this.state.editingToggle });
      }

      cancelEdit = (obj: CellUniqueObject) => {
        const itemId = this.CellUniqueObject2Id(obj);
        this._editingMap.delete(itemId);
        this.setState({ editingToggle: !this.state.editingToggle });
      }

      scroll2Cell = (obj: CellUniqueObject) => {

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
            this.props.dataManager.onAdd(undefined, 0);
          }
        } else {
          const nextCell = this.getCell(nextCol, nextRow);
          if (nextCell) {
            this.edit(nextCell)
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
        let nextCol = currentPositionOfCell.col;
        let nextRow = currentPositionOfCell.row + 1;

        if (nextRow >= rowMax) {
          // 向下增加一行
          if (config.allowDownAddRow) {
            this.props.dataManager.onAdd(undefined, rowMax);
          }
        } else {
          const nextCell = this.getCell(nextCol, nextRow);
          if (nextCell) {
            this.edit(nextCell)
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
        console.log(currentPositionOfCell, config, 'moveToPreviousEditableCell' )
        if (!(nextCol !== undefined && nextRow !== undefined)) {
          // 第一个可编辑单元格
          if (config.allowUp2Bottom) {
            if (this._lastCell) {
              this.edit(this._lastCell);
            }
          }
        } else {
          const nextCell = this.getCell(nextCol, nextRow);
          console.log(nextCell, 'moveToPreviousEditableCell nextCell' )
          if (nextCell) {
            if (currentPositionOfCell.row === nextRow + 1) {
              if (config.allowColumnLeftBackRow) {
                this.edit(nextCell);
              }
            }
            if (currentPositionOfCell.row === nextRow) {
              this.edit(nextCell);
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
        console.log(currentPositionOfCell, config, 'moveToNextEditableCell' )
        if (!(nextCol !== undefined && nextRow !== undefined)) {
          // 某一个不存在，最后一个可编辑单元格
          if (config.allowDownAddRow) {
            // 向下增加一行
            this.props.dataManager.onAdd(undefined, rowMax);
          } else {
            if (config.allowBottom2Up) {
              if (this._firstCell) {
                // 回到上方 TODO 增加滚动定位
                this.edit(this._firstCell);
              }
            }
          }
        } else {
          const nextCell = this.getCell(nextCol, nextRow);
          console.log(nextCell, 'moveToNextEditableCell nextCell' )
          if (nextCell) {
            if (currentPositionOfCell.row === nextRow - 1) {
              // 右方换行
              if (config.allowColumnRightBreakRow) {
                this.edit(nextCell);
              }
            }
            if (currentPositionOfCell.row === nextRow) {
              this.edit(nextCell);
            }
          }
        }

      }

      // todo 嵌套一个动画组件
      // 考虑下其它表格激活后，切换
      render() {
        console.log(this.props, 'tableWithContollertableWithContoller')
        return (
          <div onBlur={() => {
            // console.log('onBluronBluronBluronBlur')
            this.setState({ selected: null })
          }}>
            <Target
              tableController={this.tableController}
              {...this.props}
            />
          </div>
        )
      }

    }
  }


}

export * from './with-keyboard-handler';
export * from './tabelcontroller-util';