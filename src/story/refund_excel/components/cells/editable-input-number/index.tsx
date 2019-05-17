

import React, { Component } from 'react'
import 'antd/lib/input-number/style/index.css'
import 'antd/lib/input/style/index.css'
import './index.less'
import { Input, InputNumber } from 'antd';
import { TableControllerKeyboardHanlder, TableControllerUtil } from '../../../../../components'

export default class EditableInputNumber extends Component<{
  value: number;
  editing?: boolean;
  onEdit: (value?: number) => void;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & TableControllerKeyboardHanlder, any> {


  private _isPressArrowUpDown?: boolean;

  // onChange = (value?: number) => {
  //   console.log(this._isPressArrowUpDown, value, 'this._isPressArrowUpDown')
  //   if (this._isPressArrowUpDown) return;
  //   this.props.onEdit(value);
  // }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(this._isPressArrowUpDown, value, 'this._isPressArrowUpDown')
    if (this._isPressArrowUpDown) return;
    this.props.onEdit(parseInt(e.target.value, 10));
  }

  render() {

    const {
      value,
      editing,
      handleKeyUp,
    } = this.props;

    if (!editing) {
      return <div className="gm-editable-input-number">{value}</div>
    }

    return (
      <div className="gm-editable-input-number">
        <Input
          autoFocus
          value={value}
          onChange={this.onChange}
          onKeyUp={(e: React.KeyboardEvent) => {
            handleKeyUp(e, value);
          }}
        />
      </div>
    )
  }
}
