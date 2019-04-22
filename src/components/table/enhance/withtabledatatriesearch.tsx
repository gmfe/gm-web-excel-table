import { Input, Select } from 'antd';
import * as React from 'react';
import TrieSearch from 'trie-search';

const Option = Select.Option;
// 表格内搜索

// https://www.npmjs.com/package/trie-search
// TODO 可以增加配置

// 推荐使用行列控制器先增强
export function WithTableDataTrieSearch(WrappedComponent: React.ComponentClass<any, any>, indexKey: string, searchTrieKeys: string[]) {

  return class extends React.Component<any, any> {

    private _trieTree: any;

    componentDidMount() {
      // 注册热键

      this.initTrieSearch(this.props.data);
    }

    initTrieSearch(data: any[]) {
      this._trieTree = new TrieSearch(searchTrieKeys, { min: 1, indexField: indexKey });
      this._trieTree.addAll(data);
    }

    trieSearch = (text: string) => {
      if (!this._trieTree) return;
      // 还可以配置其它类型搜索 .get(['21', '60603'])
      return this._trieTree.get(text);
    }

    handleInputChange = (e: any) => {
      const value = e.target.value;
      if (value && this._trieTree) {
        const result = this._trieTree.get(value);
        console.log(result, 'value')
      }
    }

    render() {

      const options = [].map((d: any) => <Option key={d.value}>{d.text}</Option>);

      console.log(this.props.data, 'const Option = Select.Option;')

      return (
        <div>
          {/* <Select
            showSearch
            value={this.state.value}
            // placeholder={this.props.placeholder}
            // style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            // onSearch={this.handleSearch}
            // onChange={this.handleChange}
            notFoundContent={null}
          >
            {options}
          </Select> */}
          <WrappedComponent
            {...this.props}
            trieSearch={this.trieSearch}
          />
        </div>
      )
    }

  }
}