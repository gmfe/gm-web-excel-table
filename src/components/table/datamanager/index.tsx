
import uniqid from 'uniqid';
import * as React from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { GMConfigData } from '../constants/interface';
import { TableTransactionUtil } from '../transactions/transactionutil';
import { DataManagerEvents, IDataManager, IDataManagerChangeType } from './interface';



type IData = any;

/**
 * 数据管理 | 数据注入
 *
 * @export
 * @param {React.ComponentClass<any, any>} WrappedComponent
 * @returns
 */
export function WithDataManager(WrappedComponent: React.ComponentClass<any, any>) {

  return ({
    getProps,
    initData = [],
    getData,
    fetchData,
    controlled,
    defaultData,
    onDataChange,
    getOriginTableData,
    dataManagerRef,
  }: GMConfigData<IData>) => {
    return class extends React.Component<any, any> {

      public _addedListeners: Function[]
      public _removedListeners: Function[]
      public _changedListeners: Function[]

      constructor(props: any) {
        super(props);
        this.state = {
          updateToggle: false,
          dataLoading: false,
          data: controlled ? [] : this.withRowKey(initData),
        };
        this._addedListeners = [];
        this._removedListeners = [];
        this._changedListeners = [];
      }

      public dataManager(): IDataManager<any> {
        return {
          onAdd: this.handleAdd,
          onDelete: this.handleDelete,
          onUpdate: this.handleUpdate,
          addEventListener: this.addEventListener,
          getData: () => { return this.state.data },
          removeEventListener: this.removeEventListener,
        }
      }

      public withRowKey(data: IData[]) {
        return data.map((d, index) => ({ ...d, rowKey: d.rowKey || uniqid(), index }));
      }

      componentWillMount() {
        if (fetchData) {
          this.setState({ dataLoading: true });
          fetchData.then((d: any[]) => {
            this.setState({
              data: this.withRowKey(d),
              dataLoading: false
            })
          })
        }
      }

      componentDidMount() {
        if (dataManagerRef) {
          dataManagerRef({
            updateData: () => {
              this.setState({ updateToggle: !this.state.updateToggle });
            }
          })
        }
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

      handleAdd = (item: (IData | undefined)[], rowIndex?: number, callback?: Function) => {
        let data = this.getData();
        // NOTICE need to check
        const addCandiateList: IData[] = item.map(d => d === undefined ? cloneDeep(defaultData) : d);
        addCandiateList.forEach((addCandiate: IData, index: number) => {
          if (rowIndex !== undefined && rowIndex >= 0 && rowIndex <= data.length) {
            data.splice(rowIndex + index, 0, addCandiate);
          } else {
            data = data.concat(addCandiateList);
          }
          // addCandiate.dirty = true;
        });
        this._addedListeners.forEach(listener => {
          listener(addCandiateList, rowIndex);
        });

        if (controlled) {
          if (onDataChange) {
            onDataChange(
              IDataManagerChangeType.addRow,
              { add: addCandiateList, rowIndex, callback },
            );
          }
        } else {
          this.setState({
            data: this.withRowKey(data)
          }, () => {
            if (callback) callback();
          });
        }

      }

      handleDelete = (index: number, callback?: Function) => {
        const data = this.getData();
        this._removedListeners.forEach(listener => {
          listener(data[index], index);
        });
        data.splice(index, 1);
        if (controlled) {
          if (onDataChange) {
            // TODO 支持多项删除
            onDataChange(IDataManagerChangeType.deleteRow, { rowIndex: [index], callback });
          }
        } else {
          this.setState({ data: this.withRowKey(data) });
        }
      }


      handleUpdate = (newItem: Object, rowIndex: number, columnKey: string) => {
        // can do sequence with editing key
        const originData = controlled ? (getOriginTableData && getOriginTableData() || []) : this.state.data;
        const oldItem = originData[rowIndex];
        const app = this.props.app;
        const groupTransaction = TableTransactionUtil.createGroupTransaction(app);

        // TODO 删行曾行均可加入 Transaction
        TableTransactionUtil.createEditCellTransaction(
          app,
          oldItem,
          { ...oldItem, ...newItem },
          (commitedItem: any) => {
            if (controlled) {
              if (onDataChange) {
                onDataChange(
                  IDataManagerChangeType.updateCell,
                  { item: commitedItem, rowIndex, columnKey }
                );
                this._changedListeners.forEach(listener => {
                  listener(commitedItem, rowIndex);
                });
              }
            } else {
              originData.splice(rowIndex, 1, commitedItem);
              this.setState({ data: this.withRowKey(originData) }, () => {
                //  TODO 这个应该传进去 undo redo 的时候可以释放更新
                this._changedListeners.forEach(listener => {
                  listener(commitedItem, rowIndex);
                });
              });
            }
          }, groupTransaction);
        app.transactionManager().commit(groupTransaction);
      }

      getData = () => {
        let data = [];
        if (controlled && getData) {
          data = getData();
        } else {
          data = this.state.data;
        }
        return data;
      }

      render() {
        const successData = this.getData();
        const props = getProps && getProps();
        const loading = props && props.loading;
        const dataLoading = loading !==undefined ? loading : this.state.dataLoading;
        return (
          <WrappedComponent
            {...this.props}
            data={successData}
            dataLoading={dataLoading}
            dataManager={this.dataManager()}
          />
        )
      }

    }
  }

}
