
import * as React from 'react';

export function WithInputFocus(Target: React.ComponentClass<any, any>) {

  return class extends React.Component<{
    [key: string]: any,
    editing: boolean
  }, any> {
    private _inputRef?: any;
    private _focused: boolean = false;

    componentDidMount() {
      if (this.props.editing) {
        if (this._inputRef) {
          this._inputRef.focus();
          this._focused = true;
        }
      }
    }
    

    render() {

      const { editing } = this.props;
      
      if (!editing) {
        this._focused = false;
        if (this._inputRef) {
          this._inputRef.blur();
        }
      } else {
        if (!this._focused) {
          if (this._inputRef) {
            this._inputRef.focus();
            this._focused = true;
            if (this._inputRef.value) {
              this._inputRef.selectionStart = this._inputRef.selectionEnd = this._inputRef.value.length;
            }
          }
        }
      }
      return (
        <Target getInputRef={(c: any) => { this._inputRef = c; }} {...this.props} />
      )
    }

  }


}