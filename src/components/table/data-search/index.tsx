import Fuse from 'fuse.js'
import * as React from 'react';
import { GMTableExcelSearchArgs } from '../interface';
import { DataManagerEvents } from '../datamanager/interface';
import { RowcolIndextoSelectedState } from '../utils/datamap';
import { ICellInDataSheet } from '../columnrowmanager/interface';

import TrieSearch  from '../../../third-js/triesearch';
// https://www.npmjs.com/package/trie-search
// 可能也不使用trie-tree 因为只能从开始搜索

export function WithTableDataSearch(Target: React.ComponentClass<any, any>) {

  return (props: GMTableExcelSearchArgs) => {
    const { enable, SearchRenderer, searchKeys, indexKey, maxSearchResultLength = 10 } = props;

    if (!enable) {
      return class extends React.Component<any, any> {
        render() {
          return <Target {...this.props} />
        }
      }
    }

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
        // this.initTrieSearch();
        this.initFuseSearch();
        console.log(TrieSearch, indexKey, 'TrieSearch')
      }

      onDataChanged = (...args: any) => {
        console.log(args, 'onDataChanged')
        if (this._fuseSearch) {
          (this._fuseSearch as any).list = this.getDealWithData()
        }

      }

      initFuseSearch() {
        const dealwith = this.getDealWithData();
        // console.log(this.props.columnsMapData, dealwith, 'dealwithdealwithdealwiththis.props.columnsMapData')
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
        // this._trieTree = new TrieSearch(['value'], { min: 1, indexField: indexKey });
        const dealwith = this.getDealWithData();
        this._trieTree.addAll(dealwith);
        // 订阅删除 订阅增加 订阅修改
        // console.log(dealwith, searchTrieKeys, this.props.dataManager, this.props.columnsMapData)
        // this.props.dataManager.addEventListener(DataManagerEvents.added, this.onDataAdded);

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
        }
        console.log(value, 'valuevaluevaluevalue')
        this.setState({ _searchValue: value })
      }

      handleSelectCell = (rowIndex: number, colIndex: number) => {

        this.props.tableController.select(RowcolIndextoSelectedState(rowIndex, colIndex))
      }

      handleReset = () => {
        this.setState({ _searchValue: '', _searchResults: [] })
      }


      render() {
        const { _searchResults, _searchValue } = this.state;
        return (
          <div>
            {!SearchRenderer ? null :  (
            <SearchRenderer
              searchValue={_searchValue}
              onReset={this.handleReset}
              searchResults={_searchResults}
              onSelect={this.handleSelectCell}
              onSearch={this.handleInputChange}
            />)}
            <Target {...this.props} />
          </div>
        )
      }

    }
  }

}