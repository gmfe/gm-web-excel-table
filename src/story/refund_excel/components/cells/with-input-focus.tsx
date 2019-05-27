
import * as React from 'react';
import { TableControllerInterface, WithKeyboardHandlerProviderProps } from '../../../../components';


export interface WithInputFocusProviderProps{
  getInputRef: (c: any) => void;
  withInputFous: {
    cancelEdit: (fc: Function) => void,
    edit: (fc: Function) => void,
  },
}

export function WithInputFocus(Target: React.ComponentClass<any, any>) {

  return class extends React.Component<{
    [key: string]: any,
    editing: boolean,
    tableController: TableControllerInterface
  } & WithKeyboardHandlerProviderProps, any> {
    public _inputRef?: any;
    public _focused: boolean = false;
    public _cancelEditFunction?: Function;
    public _editFunction?: Function;

    startEdit = () => {

      // const position = this.props.tableController.query.getCellPosition(this.props.cell);
      // console.log(`[control-log] 当前${position && position.row}行${position && position.col}列 开始 编辑`)
      this._focused = true;
      if (this._editFunction) {
        this._editFunction();
      } else {
        if (this._inputRef) {
          this._inputRef.focus();
          if (this._inputRef.value) {
            this._inputRef.selectionStart = this._inputRef.selectionEnd = this._inputRef.value.length;
          }
        }
      }
    }

    endEdit = () => {
      // const position = this.props.tableController.query.getCellPosition(this.props.cell);
      // console.log(`[control-log] 当前${position && position.row}行${position && position.col}列 取消 编辑`)
      const { onEditEnd } = this.props;
      this._focused = false;
      if (this._cancelEditFunction) {
        this._cancelEditFunction();
      } else {
        if (this._inputRef) {
          this._inputRef.blur();
        }
      }
      onEditEnd();
    }

    componentDidMount() {
      if (this.props.editing) {
        this.startEdit();
      }
    }

    componentWillUnmount() {
      this.endEdit();
    }

    componentDidUpdate() {
      const { editing } = this.props;
      if (!editing) {
        if (this._focused) {
          this.endEdit();
        }
      } else {
        if (!this._focused) {
          this.startEdit();
        }
      }
    }


    render() {
      return (
        <Target
          withInputFous={{
            cancelEdit: (func: Function) => {
              this._cancelEditFunction = func;
            },
            edit: (func: Function) => {
              this._editFunction = func;
            }
          }}
          getInputRef={(c: any) => { this._inputRef = c; }} {...this.props}
        />
      )
    }

  }


}