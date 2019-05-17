

import React, { Component } from 'react'
import 'antd/lib/input/style/index.css'
import './index.less'
import { Input } from 'antd';
import { WithKeyboardHandlerProviderProps } from '../../../../../components'

export default class EditableInputNumber extends Component<{
  value: number;
  editing?: boolean;
  onEdit: (value?: number) => void;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps, any> {

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          onKeyDown={(e: React.KeyboardEvent) => {
            handleKeyUp(e, value);
          }}
        />
      </div>
    )
  }
}
