

import 'antd/lib/select/style/index.css'
import 'antd/lib/spin/style/index.css'
import './index.less'
import { Select, Spin, Input } from 'antd';
import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { MoveEditType, TableControllerUtil, WithKeyboardHandlerProviderProps } from '../../../../../components'
import { WithInputFocus } from '../with-input-focus';

const Option = Select.Option;


interface SearchSelectData {
  value: string;
  text: string;
}


// 商品搜索选择
export class SearchSelect extends Component<{
  value?: string;
  getInputRef: (c: any) => void;
  onSelect: (value: any) => void;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps, any> {

  private _selectRef: any;
  private _lastFetchId: number = 0;
  private _inputRef?: any;

  static defaultProps = {
    onSelect: () => { }
  }

  constructor(props: any) {
    super(props);
    this._lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    this.state = {
      data: [],
      fetching: false,
      value: props.value || undefined,
    }
  }

  componentDidMount() {
    // fetchData
    // this.focusInput();
    // TODO 控制器需要focus
  }

  focusInput = () => {
    if (this._inputRef) {
      this._inputRef.focus();
    }
  }

  fetchUser = (value: string) => {
    console.log(value, 'fetchUserfetchUserfetchUserfetchUser')
    this._lastFetchId += 1;
    const fetchId = this._lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this._lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = body.results.map((user: any) => ({
          text: `${user.name.first} ${user.name.last}`,
          value: `${user.name.first} ${user.name.last}`,
        }));
        this.setState({ data, fetching: false }, () => {
          // console.log(this._selectRef, 'this._selectRef')
          // if (this._selectRef) {
          //   this._selectRef.rcSelect.inputRef.focus();
          // }
        });
      });
  }

  handleChange = (value: string) => {
    console.log(value, 'handleChangehandleChange')
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }

  handleInputKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Tab': {
        e.preventDefault();
        break;
      }
      case 'Enter': {
        console.log('onKeyUponKeyUp EnterEnter')
        this.props.moveToNextEditableCell(MoveEditType.enter);
        TableControllerUtil.lockAKeyup = true; // 要不然会多触发一次keyUp
        break;
      }
    }
  }

  render() {
    const { fetching, data } = this.state;
    const { onSelect, value, handleKeyUp, getInputRef, onInputFocus } = this.props;

    return (
      <div
        style={{ position: 'relative' }}
        className="gm-search-select-container"
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); }}
      >
        <Input
          value={value}
          type="text"
          className="gm-search-select-input"
          onChange={(e: any) => {
            onSelect(e.target.value);
            this.fetchUser(e.target.value);
          }}
          onKeyUp={(e: React.KeyboardEvent) => {
            if (data.length) {
              return;
            }
            handleKeyUp(e, value)
          }}
          onKeyDown={this.handleInputKeyDown}
          onFocus={onInputFocus}
          ref={getInputRef}
        />
        <Select
          // autoFocus
          showSearch
          open={data.length > 0 || fetching}
          value={value}
          showArrow={false}
          filterOption={false}
          // onSearch={this.fetchUser}
          className="gm-search-select"
          onChange={this.handleChange}
          // defaultActiveFirstOption={false}
          onSelect={(value: any) => { onSelect(value); }}
          onInputKeyDown={this.handleInputKeyDown}
          notFoundContent={fetching ? <Spin size="small" /> : null}
          // ref={(c: any) => { if (c) { this._selectRef = c; }}}s
        >
          {data.map((d: SearchSelectData) => (
            <Option key={d.value}>{d.text}</Option>
          ))}
        </Select>
      </div>
    )
  }
}


export default WithInputFocus(SearchSelect);