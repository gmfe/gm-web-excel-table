import Fuse from 'fuse.js'
import * as React from 'react';
import { Input, Select } from 'antd';
import TrieSearch from './triesearch';
import { IColumn } from '../constants/columns';
import { WithTableDataSearchProps } from './interface';
import { DataManagerEvents } from '../datamanager/interface';
import { RowcolIndextoSelectedState } from '../utils/datamap';
import { ICellInDataSheet } from '../columnrowmanager/interface';

const Option = Select.Option;
// 表格内搜索

// https://www.npmjs.com/package/trie-search
// TODO 可以增加配置
// 可能也不使用trie-tree 因为只能从开始搜索

export function WithTableDataSearch(Target: React.ComponentClass<any, any>) {

  return (props: WithTableDataSearchProps) => {
    const { searchKeys, indexKey, maxSearchResultLength = 10 } = props;
    return class extends React.Component<any, any> {

      private _trieTree: any;
      private _fuseSearch?: Fuse<any, any>;

      constructor(props: any) {
        super(props);
        this.state = {
          _searchValue: '',
          _searchResults: []
        }
      }

      componentDidMount() {
        // 注册热键
        this.initTrieSearch();
        this.initFuseSearch();

      }

      onDataAdded(data: any, index: number) {
        console.log(data, index, 'onDataAdded')
      }

 

      onDataChanged = (...args: any) => {
        console.log(args, 'onDataChanged')
        if (this._fuseSearch) {
          (this._fuseSearch as any).list = this.getDealWithData()
          // console.log(this._fuseSearch.list, dealwith, 'dealwithdealwith')
        }

      }

      initFuseSearch() {
        const dealwith = this.getDealWithData();
        console.log(this.props.columnsMapData, dealwith, 'dealwithdealwithdealwiththis.props.columnsMapData')
        this._fuseSearch = new Fuse(dealwith, {
          keys: ['value'],
          shouldSort: true,
          maxPatternLength: maxSearchResultLength,
          // includeMatches: true, 
        });
        // this.props.dataManager.addEventListener(DataManagerEvents.added, this.onDataAdded);
        this.props.dataManager.addEventListener(DataManagerEvents.changed, this.onDataChanged);
        // this.props.dataManager.addEventListener(DataManagerEvents.added, this.onDataDeleted);
      }

      // https://fusejs.io/
      fuseSearch = (text: string) => {
        if (!this._fuseSearch) return;
        console.log(this._fuseSearch, 'this._fuseSearch')
        return this._fuseSearch.search(text);
      }

      getDealWithData() {
        const dealwith: { key: string, value: string, rowIndex: number, colIndex: number }[] = [];
        const searchTrieKeysMap = new Map();
        searchKeys.forEach(k => searchTrieKeysMap.set(k, true));
        this.props.columnsMapData.forEach((row: ICellInDataSheet[], ri: number) => {
          row.forEach((cell: ICellInDataSheet, cellIndex: number) => {
            if (cell.dataIndex && searchTrieKeysMap.has(cell.dataIndex)) {
              dealwith.push({
                rowIndex: ri,
                key: cell.key,
                value: cell.value,
                colIndex: cellIndex,
              });
            }
          });
        });
        return dealwith;
      }

      initTrieSearch() {
        this._trieTree = new TrieSearch(['value'], { min: 1, indexField: indexKey });

        const dealwith = this.getDealWithData();
        this._trieTree.addAll(dealwith);
        // 订阅删除 订阅增加 订阅修改
        // console.log(dealwith, searchTrieKeys, this.props.dataManager, this.props.columnsMapData)
        this.props.dataManager.addEventListener(DataManagerEvents.added, this.onDataAdded);

      }

      trieSearch = (text: string) => {
        if (!this._trieTree) return;
        // 还可以配置其它类型搜索 .get(['21', '60603'])
        return this._trieTree.get(text);
        // 排序不影响搜索结果，但是影响搜索定位
      }

      handleInputChange = (value: string) => {
        if (value) {
          const result2 = this.fuseSearch(value);
          if (result2) {
            this.setState({ _searchResults: result2.slice(0, maxSearchResultLength) })
          }
          console.log(result2, 'value')
        }
      }



      render() {

        const options = this.state._searchResults.map((d: any, index: number) => (
          <Option key={`${d.key}-${d.rowIndex}-${d.colIndex}`} value={`${d.key}-${d.rowIndex}-${d.colIndex}`} >
            <div onClick={() => {
              // console.log(this.props, 'indexindexonClickonClickindexindexindex')
              // this.props.tableController.select(RowcolIndextoSelectedState(d.rowIndex, d.colIndex));
            }}>{`${d.value} - 第${d.rowIndex}行第${d.colIndex}列`}</div>
          </Option>
          )
        );

        // console.log(this.props, 'withtabledatatriesearchwithtabledatatriesearch')

        // select 也可以抽出去配置
        return (
          <div>
            <Select
              showSearch
              showArrow={false}
              placeholder={"搜索内容"}
              filterOption={false}
              style={{ width: '90%' }}
              notFoundContent={null}
              value={this.state._searchValue}
              defaultActiveFirstOption={false}
              onSearch={this.handleInputChange}
              onChange={(key: string) => {
                const values = key.split('-');
                // console.log(values, 'valuesvalues')
                if (values.length >= 3) {
                  const rowIndex = parseInt(values[1]);
                  const colIndex = parseInt(values[2]);
                  this.props.tableController.select(RowcolIndextoSelectedState(rowIndex, colIndex))
                }
              }}
              onFocus={() => { this.setState({ _searchValue: '', _searchResults: [] }) }}
              onSelect={(...args: any) => { console.log(args, 'onSelect') }}
              onInputKeyDown={(e: any) => { console.log(e.target, 'onInputKeyDown') }}
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