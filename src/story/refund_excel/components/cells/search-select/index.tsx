

import './index.less'
import { ToolTip, MoreSelect } from 'react-gm'
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import { WithInputFocus, WithInputFocusProviderProps } from '../with-input-focus';
import { MoveEditType, TableControllerUtil, WithKeyboardHandlerProviderProps, CellUniqueObject } from '../../../../../components'



export interface GMMoreSelectData {
  label: string,
  children: { value: string, text: string }[]
}

// 商品搜索选择
export class SearchSelect extends Component<{
  value?: string;
  cell: CellUniqueObject;
  editing: boolean;
  onSelect: (value: any) => void;
  onSearch: (value: string) => Promise<any>;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
  mapSearchDataToSelect: (data: any) => GMMoreSelectData[];
} & WithKeyboardHandlerProviderProps & WithInputFocusProviderProps
  , any> {

  private _popRef: any;
  private _lastFetchId: number = 0;
  private _containerRef: any;

  static defaultProps = {
    onSelect: () => { }
  }

  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      // fetching: false,
      value: props.value || undefined,
      showMoreSelectPopWindow: false,
      selected: { text: '', value: null },
    }
    this._lastFetchId = 0;
    this.handleSearch = debounce(this.handleSearch, 500);
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


  handleSearch = async (value: string) => {
    return new Promise(res => {
      this._lastFetchId += 1;
      const fetchId = this._lastFetchId;
      this.setState({
        data: [],
        // fetching: true
      });
      return this.props.onSearch(value).then((searchResult: any) => {
        if (fetchId !== this._lastFetchId) {
          return;
        }
        this.setState({
          data: this.props.mapSearchDataToSelect(searchResult),
          // fetching: false,
        }, () => {
          res()
        });
      })
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
    const { data, selected } = this.state;
    const { onSelect, value, editing, handleKeyUp, onEditStart } = this.props;

    const isFinished = !editing && value && value.length > 0;

    let isFinishedAndCollasped: boolean = false;

    if (value && isFinished && this._containerRef) {
      // TODO 并且要计算文字处于...状态
      isFinishedAndCollasped = value.length > (this._containerRef.clientWidth / 12) + 3;
    }

    return (
      <ToolTip
        top
        showArrow={false}
        popup={isFinishedAndCollasped ? (
          <div
            style={{
              display: 'inline-block',
              width: this._containerRef && this._containerRef.clientWidth,
              wordBreak: 'break-all'
            }}
          >
            {selected && selected.text}
          </div>
        )
          : <span />}
      >
        <div
          className="gm-search-select-container"
          style={{ width: '100%', height: '100%' }}
          ref={(c: any) => { this._containerRef = c }}
          onClick={() => {
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
            popRef={(pop: any) => { this._popRef = pop }}
            popoverClassName="gm-refund-table--more-select-popover"
            selected={selected && selected.value ? selected : undefined}
            onSelect={(selected: any) => {
              onSelect(selected)
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
            <input
              disabled
              onChange={() => { }}
              value={selected && selected.text}
            />
          </MoreSelect>

        </div>
      </ToolTip>
    )
  }
}


export default WithInputFocus(SearchSelect);