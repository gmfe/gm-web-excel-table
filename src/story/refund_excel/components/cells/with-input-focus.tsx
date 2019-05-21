
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

      if (editing && !this._focused) {
        console.log(this.props, this._inputRef, 'this._focusedthis._focused')
      }
      
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
          }
        }
      }
      return (
        <Target getInputRef={(c: any) => { this._inputRef = c; }} {...this.props} />
      )
    }

  }


}