import { Input, Select } from 'antd';
import * as React from 'react';
import TrieSearch from 'trie-search';
import { WithTableDataTrieSearchProps } from './interface';

const Option = Select.Option;
// 表格内搜索

// https://www.npmjs.com/package/trie-search
// TODO 可以增加配置

// 推荐使用行列控制器先增强
export function WithTableDataTrieSearch(Target: React.ComponentClass<any, any>) {

  return (props: WithTableDataTrieSearchProps) => {
    const { searchTrieKeys, indexKey } = props;
    return class extends React.Component<any, any> {

      private _trieTree: any;

      constructor(props: any) {
        super(props);
        this.state = {
          _searchValue: ''
        }
      }

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
            <Select
              showSearch
              value={this.state._searchValue}
              placeholder={"搜索内容"}
              style={{ width: 200 }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              // onSearch={this.handleSearch}
              onChange={this.handleInputChange}
              notFoundContent={null}
            >
              {options}
            </Select>
            <Target
              {...this.props}
              trieSearch={this.trieSearch}
            />
          </div>
        )
      }

    }
  }

}