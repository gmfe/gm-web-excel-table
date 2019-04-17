


import * as React from 'react'
import { ColumnProps } from 'antd/lib/table';



// todo 需要传入 tableKey
// 传入 Table Header 高，左边界 (定位到第一个单元格左上角)
export function WithTableController(WrappedComponent: React.ComponentClass<any, any>, tableKey: string, columns: any[]) {

  return class extends React.Component<any, any> {

    // columnKey
    private _sizeMap: Map<string, { width: number, height: number }>;
    private _refMap: Map<string, HTMLElement>;
    private _editMap: Map<string, boolean>;

    constructor(props: any) {
      super(props);
      this.state = {
        tableActive: true,
        // 由这层控制，以满足多编辑竞争的需求
        editing: {
          target: '',
        },
        following: {
          // rowColumnPosition: [0, 0],
          // ref: undefined,
          stylePosition: { top: 0, left: 0 },
        },
        // following: undefined, // [0, 0] // 框
        focusing: undefined // [ 0, 0 ]
      };
      // 做一个查找树
      this._sizeMap = new Map();
      this._refMap = new Map();
      this._editMap = new Map();

      // 注册按键移动事件
      // 注册快捷键
    }

    componentDidUpdate() {
      // 其它表格激活后 卸载此事件钩子
    }

    init() {
      // 表格初始化 多个表格同时存在的时候 需要进行切换
    }

    rowColumnPositionToId = (columnKey: string, row: number) => {
      return `${tableKey}-${columnKey}-${row}`;
    }

    handleMoveFollowing(nextIndex: any) {
      // 增加一个自身当前宽高的尺寸
    }

    handleFocus(columnKey: string, row: number) {
      const ref = this._refMap.get(this.rowColumnPositionToId(columnKey, row));
      if (ref) {
        ref.focus();
      }
      // todo 增加一个查找逻辑
    }

    handleEdit(columnKey: string, row: number) {
      const itemId = this.rowColumnPositionToId(columnKey, row);
      if (this._editMap.get(itemId)) {
        return;
      }

      if (this.state.editing.target) {
        // 
        // return;
      }
      this.setState({ editing: {
        target: itemId,
      }})
    }

    focusAdded = () => {
      
    }

    // todo 嵌套一个动画组件
    // 考虑下其它表格激活后，切换
    render() {
      return (
        <div>
          {
            this.state.index ? null : null
          }
          <div style={{ width: 100, height: 100, position: "absolute", ...this.state }}>
            移动框
          </div>
          <WrappedComponent
            tableController = {{
              handleMoveFollowing: this.handleMoveFollowing.bind(this),
              handleFocus: this.handleFocus.bind(this),
              handleEdit: this.handleEdit.bind(this),
            }}
            {...this.props}
          />
        </div>
      )
    }

  }
}