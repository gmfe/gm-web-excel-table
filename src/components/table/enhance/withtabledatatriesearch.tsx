import { Input } from 'antd';
import * as React from 'react';
import TrieSearch from 'trie-search';


// 表格内搜索

// https://www.npmjs.com/package/trie-search
// TODO 可以增加配置

// 推荐使用行列控制器先增强
export function WithTableDataTrieSearch(WrappedComponent: React.ComponentClass<any, any>, indexKey: string, searchTrieKeys: string[]) {


  return class extends React.Component<any, any> {

    private _trieTree: any;

    componentDidMount() {
      // 注册热键
      console.log(this.props, 'componentDidMount')
    }

    initTrieSearch(data: any[]) {
      this._trieTree = new TrieSearch(searchTrieKeys, { min: 3, indexField: 'key' });
      this._trieTree.addAll(data);
    }

    trieSearch = (text: string) => {
      if (!this._trieTree) return;
      // 还可以配置其它类型搜索 .get(['21', '60603'])
      return this._trieTree.get(text);
    }

    handleInputChange = (e: any) => {
      console.log(e, 'handleInputChange')
    }

    render() {

      return (
        <div>
          <Input onChange={this.handleInputChange} />
          <WrappedComponent
            {...this.props}
            trieSearch={this.trieSearch}
          />
        </div>
      )
    }

  }
}