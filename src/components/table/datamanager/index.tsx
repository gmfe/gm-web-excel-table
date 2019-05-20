
import * as React from 'react'
import { GMConfigData } from '../constants/interface';
import { DataManagerEvents, IDataManager } from './interface';
import { TableTransactionUtil } from '../transactions/transactionutil';
import uniqid from 'uniqid';



// TODO 后续 initData 这里应该是传入 fetchData的逻辑
type IData = any;

/**
 * 数据管理 | 数据注入
 * 
 * @export
 * @param {React.ComponentClass<any, any>} WrappedComponent
 * @returns
 */
export function WithDataManager(WrappedComponent: React.ComponentClass<any, any>) {

  return ({ initData, defaultData  }: GMConfigData<IData>) => {
    return class extends React.Component<any, any> {

      public _addedListeners: Function[]
      public _removedListeners: Function[]
      public _changedListeners: Function[]

      constructor(props: any) {
        super(props);
        this.state = { data: this.withRowKey(initData) };
        this._addedListeners = [];
        this._removedListeners = [];
        this._changedListeners = [];
      }

      addEventListener = (eventKeys: DataManagerEvents, listener: Function) => {
        // 简单版实现，具体需要注意一些特殊情况
        // https://dev.to/em4nl/function-identity-in-javascript-or-how-to-remove-event-listeners-properly-1ll3
        switch (eventKeys) {
          case DataManagerEvents.added: {
            this._addedListeners.push(listener);
            break;
          }
          case DataManagerEvents.deleted: {
            this._removedListeners.push(listener);
            break;
          }
          case DataManagerEvents.changed: {
            this._changedListeners.push(listener);
            break;

          }
        }
      }

      removeEventListener = (eventKeys: DataManagerEvents, listener: Function) => {
        let targetListeners: Function[] = []
        switch (eventKeys) {
          case DataManagerEvents.added: {
            targetListeners = this._addedListeners;
            break;
          }
          case DataManagerEvents.deleted: {
            targetListeners = this._removedListeners;
            break;
          }
          case DataManagerEvents.changed: {
            targetListeners = this._changedListeners;
            break;
          }
        }
        for (let i = 0; i < targetListeners.length; i++) {
          if (targetListeners[i] === listener) {
            targetListeners.splice(i, 1)
            break;
          }
        }
      }

      handleAdd = (item?: IData[], rowIndex?: number, callback?: () => void) => {
        // TODO 可以加一个字段校验，与当前的 item keys 需要匹配
        let data = this.state.data;

        const addCandiateList: IData[] = item && item.length ? item : new Array(5).fill(defaultData);

        addCandiateList.forEach((addCandiate: IData, index: number) => {
          if (rowIndex !== undefined && rowIndex >= 0 && rowIndex <= data.length) {
            data.splice(rowIndex + index, 0, addCandiate);
          } else {
            data = data.concat(addCandiateList);
          }
        });

        this._addedListeners.forEach(listener => {
          listener(addCandiateList, rowIndex);
        });

        this.setState({ data: this.withRowKey(data) }, () => {
          if (callback) callback();
        });

      }

      handleDelete = (index: number) => {
        const data = this.state.data;
        this._removedListeners.forEach(listener => {
          listener(data[index], index);
        });
        data.splice(index, 1);
        this.setState({ data: this.withRowKey(data) });
      }

      handleUpdate = (newItem: Object, rowIndex: number) => {
        // can do sequence
        const newData = [...this.state.data];
        const oldItem = newData[rowIndex];
        const app = this.props.app;
        const groupTransaction = TableTransactionUtil.createGroupTransaction(app);
        TableTransactionUtil.createEditCellTransaction(
          app,
          oldItem,
          { ...oldItem, ...newItem },
          (commitedItem: any) => {
            newData.splice(rowIndex, 1, commitedItem);
            this.setState({ data: this.withRowKey(newData) }, () => {
              //  TODO 这个应该传进去 undo redo 的时候可以释放更新
              this._changedListeners.forEach(listener => {
                listener(commitedItem, rowIndex);
              });
            });
          }, groupTransaction);
        app.transactionManager().commit(groupTransaction);
      }

      public dataManager () : IDataManager<any> {
        return {
          onAdd: this.handleAdd,
          onDelete: this.handleDelete,
          onUpdate: this.handleUpdate,
          addEventListener: this.addEventListener,
          getData: () => { return this.state.data },
          removeEventListener: this.removeEventListener,
          setData: (data: any[]) => { this.setState({ data: this.withRowKey(data) }) },
        }
      }

      public withRowKey(data: IData[]) {
        return data.map((d, index) => ({ ...d, rowKey: d.rowKey || uniqid(), index }));
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            data={this.state.data}
            dataManager={this.dataManager()}
          />
        )
      }

    }
  }

}
