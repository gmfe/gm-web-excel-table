


import * as React from 'react'
import { TableTransactionUtil } from '../transactions/transactionutil';


// https://reactjs.org/docs/higher-order-components.html

// todo 后续 initData 这里应该是传入 fetchData的逻辑

// 只与数据操作有关的逻辑
export function WithDataManager(
  WrappedComponent: React.ComponentClass<any, any>,
  initData: any[] = [],
  defaultData: any,
) {

  return class extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = { data: initData };
    }

    mapData = (data: any[]) => {
      return data.map(d => {
        let row: any[] = [];
        Object.entries(d).forEach((pairs: any) => {
          row.push({
            value: pairs[1],
            dataIndex: pairs[0],
          });
        });
        return row;
      });

    }

    handleSearch = (text: string) => {
      // const result = this.trie.search()
    }

    handleAdd = (item: any, rowIndex?: number, callback?: () => void) => {
      // TODO 可以加一个字段校验，与当前的 item keys 需要匹配
      let data = this.state.data;
      if (rowIndex !== undefined && rowIndex >= 0 && rowIndex <= data.length) {
        data.splice(rowIndex, 0, item);
      } else {
        data = data.concat([ item ]);
      }
      this.setState({ data }, () => {
        // TODO 需要传定位
        if (callback) callback();
      });

    }

    handleDelete = (index: number) => {
      this.state.data.splice(index, 1);
      this.setState({ data: this.state.data });
    }

    handleUpdate = (newItem: any, rowIndex: number) => {
      const newData = [...this.state.data];
      const oldItem = newData[rowIndex];
      const groupTransaction = TableTransactionUtil.createGroupTransaction(this.props.app);
      TableTransactionUtil.createEditCellTransaction(
        this.props.app,
        oldItem,
        newItem,
        (commitedItem: any) => {
          newData.splice(rowIndex, 1, commitedItem);
          this.setState({ data: newData });
      }, groupTransaction);
      this.props.app.transactionManager().commit(groupTransaction);
    }

    render() {
      // todo add memorize
      // const mapData = this.mapData(this.state.data);
      return (
        <WrappedComponent
          data={this.state.data}
          {...this.props}
          dataManager={{
            onAdd: this.handleAdd,
            onDelete: this.handleDelete,
            onSearch: this.handleSearch,
            onUpdate: this.handleUpdate
          }}
        />
      )
    }

  }
}
