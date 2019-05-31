

import React, { Component } from 'react'
import './index.less'
import cx from 'classnames';
import { InputNumber, ToolTip } from 'react-gm'
import { WithKeyboardHandlerProviderProps } from '../../../../../components'
import { WithInputFocus, WithInputFocusProviderProps } from '../with-input-focus';


export class EditableInputNumber extends Component<{
  editing?: boolean;
  className?: string;
  value: string;
  onChange: (value?: number | string) => void;
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
} & WithKeyboardHandlerProviderProps & WithInputFocusProviderProps, any> {

  public _inputRef: any;
  public _containerRef?: HTMLElement;

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
      editing,
      // getInputRef,
      className,
      handleKeyUp,
      onEditStart
    } = this.props;

    // if (!editing) {
    //   return <div className="gm-excel-editable-input-number">{value}</div>
    // }
    const isFinished = !editing && value && value.length > 0;

    let isFinishedAndCollasped: boolean = false;

    if (isFinished && this._containerRef) {
      // TODO 并且要计算文字处于...状态
      isFinishedAndCollasped = value.length * 20 > this._containerRef.clientWidth;
    }

    return (
      <div ref={(c: any) => { this._containerRef = c }} className={cx("gm-excel-editable-input-number", {
        [`gm-excel-editable-input-number-${className}`]: className !== undefined,
        '-editing': editing,
        '-finished': isFinished,
      })}>

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
              {value}
            </div>
          )
            : <span />}
        >
          {/* InputNumberV2 cannot get mouse selection */}
          <InputNumber
            value={value || ''}
            precision={2}
            onChange={this.onChange}
            getInputRef={(c: any) => { this._inputRef = c }}
            onInputKeyUp={(e: React.KeyboardEvent) => {
              handleKeyUp(e, value);
            }}
            onInputFocus={() => {
              onEditStart();
            }}
          />
        </ToolTip>
      </div>
    )
  }
}


export default WithInputFocus(EditableInputNumber);