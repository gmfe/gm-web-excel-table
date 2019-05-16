

import 'antd/lib/select/style/index.css'
import 'antd/lib/spin/style/index.css'
import './index.less'
import { Select, Spin, Input } from 'antd';
import React, { Component } from 'react';
import debounce from 'lodash/debounce';


const Option = Select.Option;


interface SearchSelectData {
  value: string;
  text: string;
}

// 商品搜索选择
export default class SearchSelect extends Component<{
  value?: string;
  onSelect: (value: any) => void;
}, any> {

  private _selectRef: any;
  private _lastFetchId: number = 0;
  private _inputRef?: any;

  static defaultProps = {
    onSelect: () => {}
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
    this.focusInput();
  }

  componentDidUpdate() {
    this.focusInput();
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
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
  };

  handleChange = (value: string) => {
    console.log(value, 'handleChangehandleChange')
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  handleInputKeyDown = (e: any) => {
    // console.log(e, 'handleInputKeyDown')
  }

  render() {
    const { onSelect } = this.props;
    const { fetching, data, value } = this.state;

    return (
      <div
        style={{ position: 'relative' }}
        className="gm-search-select-container"
        onBlur={() => {
          console.log('gm-search-select-container blur')
        }}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); }}
      >
        <Input
          value={this.props.value}
          type="text"
          className="gm-search-select-input"
          onChange={(e: any) => {
            onSelect(e.target.value);
            this.fetchUser(e.target.value);
          }}
          ref={(c: any) => { if (c) { this._inputRef = c; }}}
        />
        <Select
          showSearch
          open={true}
          // value={value}
          showArrow={false}
          filterOption={false}
          // onSearch={this.fetchUser}
          className="gm-search-select"
          onChange={this.handleChange}
          defaultActiveFirstOption={false}
          onSelect={(value: any) => { onSelect(value); }}
          onInputKeyDown={this.handleInputKeyDown}
          notFoundContent={fetching ? <Spin size="small" /> : null}
          // ref={(c: any) => { if (c) { this._selectRef = c; }}}
        >
          {data.map((d: SearchSelectData) => (
            <Option key={d.value}>{d.text}</Option>
          ))}
        </Select>
      </div>
    )
  }
}
