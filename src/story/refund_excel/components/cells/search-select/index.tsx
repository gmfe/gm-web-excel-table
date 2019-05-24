

import './index.less'
import { MoreSelect } from 'react-gm'
import debounce from 'lodash/debounce';
import React, { Component, useMemo } from 'react';
import { WithInputFocus } from '../with-input-focus';
import { MoveEditType, TableControllerUtil, WithKeyboardHandlerProviderProps, CellUniqueObject } from '../../../../../components'



interface SearchSelectData {
  value: string;
  text: string;
}


// 商品搜索选择
export class SearchSelect extends Component<{
  value?: string;
  cell: CellUniqueObject;
  getInputRef: (c: any) => void;
  onSelect: (value: any) => void;
  withInputFous: {
    cancelEdit: (fc: Function) => void,
    edit: (fc: Function) => void,
  },
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps, any> {

  private _selectRef: any;
  private _lastFetchId: number = 0;
  private _inputRef?: any;
  private _popRef: any;

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
      showMoreSelectPopWindow: false,
      selected: [],
    }
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

  fetchUser = (value: string) => {
    console.log(value, 'fetchUserfetchUserfetchUserfetchUser')
    this._lastFetchId += 1;
    const fetchId = this._lastFetchId;
    this.setState({ data: [], fetching: true });
    return fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this._lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = body.results.map((user: any) => ({
          text: `${user.name.first} ${user.name.last} ${value}`,
          value: `${user.name.first} ${user.name.last}`,
        }));
        this.setState({
          fetching: false,
          data: [{ label: 'x', children: data }],
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

  handleEnter = (index: number) => {
    console.log(index, this.state.coolData.list[index]);
    this.setState({
      input: this.state.coolData.list[index].name,
      show: false
    });
  }

  onHide = () => {
    this.setState({
      show: false
    });
  }



  registerRef = (c: any) => {
    this._selectRef = c;
    if (c) {

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
          // multiple
          selected={this.state.selected}
          onSelect={(selected: any) => {
            console.log(selected, 'selectedselected')
            onSelect(selected.text)
            this.setState({ selected })
          }}
          popRef={(pop: any) => { this._popRef = pop }}
          popoverType={'click'}
          onSearch={this.fetchUser}
          onInputKeyUp={(e: React.KeyboardEvent) => {
            if (data.length) {
              return;
            }
            handleKeyUp(e, value)
          }}
          onInputFocus={() => {
            onEditStart();
          }}
        >
          <p>
            {value}
          </p>
        </MoreSelect>

      </div>
    )
  }
}


export default WithInputFocus(SearchSelect);