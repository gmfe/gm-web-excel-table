

import './index.less'
import { MoreSelect } from 'react-gm'
import debounce from 'lodash/debounce';
import React, { Component, useMemo } from 'react';
import { WithInputFocus, WithInputFocusProviderProps } from '../with-input-focus';
import { MoveEditType, TableControllerUtil, WithKeyboardHandlerProviderProps, CellUniqueObject } from '../../../../../components'




// 商品搜索选择
export class SearchSelect extends Component<{
  value?: string;
  cell: CellUniqueObject;
  onSelect: (value: any) => void;
  onSearch: (value: string) => Promise<any>;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps & WithInputFocusProviderProps
  , any> {

  private _popRef: any;
  private _inputRef?: any;
  private _lastFetchId: number = 0;

  static defaultProps = {
    onSelect: () => { }
  }

  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      fetching: false,
      value: props.value || undefined,
      showMoreSelectPopWindow: false,
      selected: { text: '', value: null },
    }
    this._lastFetchId = 0;
    this.handleSearch = debounce(this.handleSearch, 800);
  }

  componentDidMount() {
    this.props.withInputFous.cancelEdit(() => {
      if (this._popRef) {
        this._popRef.close();
      }
    });
    this.props.withInputFous.edit(() => {
      if (this._popRef) {
        this._popRef.show();
      }
    });
  }

  focusInput = () => {
    if (this._inputRef) {
      this._inputRef.focus();
    }
  }

  handleSearch = async (value: string) => {
    this._lastFetchId += 1;
    const fetchId = this._lastFetchId;
    this.setState({ data: [], fetching: true });
    return this.props.onSearch(value).then((searchResult: any) => {
      if (fetchId !== this._lastFetchId) {
        return;
      }
      this.setState({
        data: searchResult,
        fetching: false,
      });
    }).catch(() => {
      this.setState({ fetching: false })
      // some error handler
    })
  }

  /**
   * 处理 MoreSelect 输入框 KeyDown 事件
   *
   * @memberof SearchSelect
   */
  handleInputKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Tab': {
        if (this._popRef) {
          this._popRef.close();
        }
        break;
      }
      case 'Enter': {
        this.props.moveToNextEditableCell(MoveEditType.enter);
        TableControllerUtil.lockAKeyup = true;
        break;
      }
    }
  }

  render() {
    const { data } = this.state;
    const { onSelect, value, handleKeyUp, onEditStart } = this.props;

    return (
      <div
        className="gm-search-select-container"
        style={{ width: '100%', height: '100%' }}
        onClick={(e: React.MouseEvent) => {
          if (this._popRef) {
            this._popRef.show();
          }
        }}
      >
        <MoreSelect
          data={data}
          isGroupList
          popoverType={'click'}
          onSearch={this.handleSearch}
          selected={this.state.selected}

          popRef={(pop: any) => { this._popRef = pop }}
          onSelect={(selected: any) => {
            onSelect(selected.text)
            this.setState({ selected })
          }}
          onInputFocus={() => { onEditStart(); }}
          onInputKeyDown={this.handleInputKeyDown}
          onInputKeyUp={(e: React.KeyboardEvent) => {
            if (data.length) {
              return;
            }
            handleKeyUp(e, value)
          }}
        >
        </MoreSelect>

      </div>
    )
  }
}


export default WithInputFocus(SearchSelect);