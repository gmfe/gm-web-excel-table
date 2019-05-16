import * as React from 'react'
import { CellUniqueObject, WithTableControllerConfig, TableControllerInterface } from './interface';
import { KeyboardEventContext, AppBase } from 'kunsam-app-model';



export function WithTableController(Target: React.ComponentClass<any, {
  [key: string]: any,
  editingToggle: boolean,
}>) {

  return (config: WithTableControllerConfig) => {
    return class extends React.Component<any, any>  {
      // columnKey
      private _editingMap: Map<string, boolean>;
      // private _refMap: Map<string, HTMLElement>;
      // private _sizeMap: Map<string, { width: number, height: number }>;

      public get tableController(): TableControllerInterface {
        return {
          selectedCells: this.state.selected,
          select: this.select.bind(this),
          edit: this.handleEdit.bind(this),
          cancelEdit: this.cancelEdit,
          uniqueEdit: this.uniqueEdit,
          query: {
            isEditing: (obj: CellUniqueObject) => { return this._editingMap.has(this.CellUniqueObject2Id(obj)) }
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

        // 注册按键移动事件
        // 注册快捷键
      }

      public CellUniqueObject2Id(obj: CellUniqueObject) { return `${obj.columnKey}-${obj.rowKey}` }

      componentDidMount() {
        const app: AppBase = this.props.app;
        app.eventManager().keyboardEvents().listenKeyDown((context: KeyboardEventContext) => {
          console.log(context, 'contextcontextcontext')
        });
      }


      componentDidUpdate() {
        // 其它表格激活后 卸载此事件钩子
      }

      init() {
        // 表格初始化 多个表格同时存在的时候 需要进行切换
      }

      rowColumnPositionToId = (columnKey: string, row: number) => {
        return `${config.tableKey}-${columnKey}-${row}`;
      }

      select = () => {
        // this.setState({ selected: state });
        // TODO 还需要增加 XY方向上的滚动定位
      }

      handleEdit(obj: CellUniqueObject) {
        const itemId = this.CellUniqueObject2Id(obj);
        if (this._editingMap.get(itemId)) {
          return;
        }
        this._editingMap.set(itemId, true);
        this.setState({ editingToggle: !this.state.editingToggle });

      }

      uniqueEdit = (obj: CellUniqueObject) => {
        const itemId = this.CellUniqueObject2Id(obj);
        if (this._editingMap.get(itemId)) {
          return;
        }
        this._editingMap.clear();
        this._editingMap.set(itemId, true);
        this.setState({ editingToggle: !this.state.editingToggle });
      }

      cancelEdit = (obj: CellUniqueObject) => {
        const itemId = this.CellUniqueObject2Id(obj);
        this._editingMap.delete(itemId);
        this.setState({ editingToggle: !this.state.editingToggle });
      }

      focusAdded = () => {

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
