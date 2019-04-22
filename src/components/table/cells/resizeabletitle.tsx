
import * as React from 'react';
import Resizable from  're-resizable';
import { onResizeColumn } from '../columnrowmanager/constants';

export class ResizeableTitle extends React.PureComponent<{
  width?: number,
  minWidth?: number,
  maxWidth?: number,
  onResize: onResizeColumn,
  onResizeStart: () => void,
}, any> {

  private _resizable: any;

  handleResize = (...args: any) => {
    const newWidth = (args[2] as HTMLElement).offsetWidth;
    this.props.onResize({ width: newWidth });
  }

  render() {
    const { width, minWidth, maxWidth, onResizeStart } = this.props;
    return (
      // https://github.com/bokuweb/re-resizable
      // snap: may be useful
      <Resizable
        ref={c => this._resizable = c}
        onResize={this.handleResize}
        style={{ display: 'inline-block', border: '1px solid #ccc'}}
        minWidth={minWidth || 100}
        maxWidth={maxWidth || 1000}
        enable={{ top: false, right:true, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
        defaultSize={{ width }}
        // size={{ width }}
        onResizeStart={onResizeStart}
      >
        {this.props.children}
      </Resizable>
    );
  }
}


// export const ResizeableTitle = (props: any) => {




// };

// export ResizeableTitle