

import React, { Component } from 'react'
import './index.less'
import cx from 'classnames';
import { InputNumber } from 'react-gm'
import { WithKeyboardHandlerProviderProps } from '../../../../../components'
import { WithInputFocus, WithInputFocusProviderProps } from '../with-input-focus';


export class EditableInputNumber extends Component<{
  editing?: boolean;
  className?: string;
  value: number | string;
  onChange: (value?: number | string) => void;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps & WithInputFocusProviderProps, any> {

  private _inputRef: any;

  // onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   this.props.onChange(parseInt(e.target.value, 10));
  // }

  onChange = (value: any) => {
    this.props.onChange(value);
  }

  componentDidMount() {
    this.props.withInputFous.cancelEdit(() => {
      if (this._inputRef) {
        this._inputRef.blur();
      }
    });
    this.props.withInputFous.edit(() => {
      if (this._inputRef) {
        this._inputRef.focus();
      }
    });
  }

  render() {

    const {
      value,
      // editing,
      // getInputRef,
      className,
      handleKeyUp,
      onEditStart
    } = this.props;

    // if (!editing) {
    //   return <div className="gm-excel-editable-input-number">{value}</div>
    // }

    return (
      <div className={cx("gm-excel-editable-input-number", {
        [`gm-excel-editable-input-number-${className}`]: className !== undefined,
      })}>
        <InputNumber
          value={value}
          precision={2}
          getInputRef={(c: any) => { this._inputRef = c }}
          onChange={this.onChange}
          onInputKeyUp={(e: React.KeyboardEvent) => {
            handleKeyUp(e, value);
          }}
          onInputFocus={(e: any) => {
            onEditStart();
          }}
        />
      </div>
    )
  }
}


export default WithInputFocus(EditableInputNumber);