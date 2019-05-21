

import React, { Component } from 'react'
import 'antd/lib/input/style/index.css'
import './index.less'
import { Input } from 'antd';
import { WithKeyboardHandlerProviderProps } from '../../../../../components'
import { WithInputFocus } from '../with-input-focus';

export class EditableInputNumber extends Component<{
  value: number;
  editing?: boolean;
  onEdit: (value?: number) => void;
  getInputRef: (c: any) => void;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps, any> {

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onEdit(parseInt(e.target.value, 10));
  }


  render() {

    const {
      value,
      editing,
      getInputRef,
      handleKeyUp,
    } = this.props;

    // if (!editing) {
    //   return <div className="gm-editable-input-number">{value}</div>
    // }

    return (
      <div className="gm-editable-input-number">
        <Input
          ref={getInputRef}
          value={value}
          onChange={this.onChange}
          onKeyUp={(e: React.KeyboardEvent) => {
            handleKeyUp(e, value);
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Tab') {
              e.preventDefault();
            }
          }}
        />
      </div>
    )
  }
}


export default WithInputFocus(EditableInputNumber);