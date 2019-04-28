
import * as React from 'react';
import Resizable from 're-resizable';
import { onResizeColumn } from '../columnrowmanager/interface';
import { DEFAULT_RANGE } from '../columnrowmanager/constants';
import { GMExcelTableColumnState } from '../constants/interface';

export class ResizeableTitle extends React.PureComponent<GMExcelTableColumnState & {
  onResize: onResizeColumn,
  onResizeStart: () => void,
}, any> {

  // private _resizable: any;

  handleResize = (...args: any) => {
    const newWidth = (args[2] as HTMLElement).offsetWidth;
    this.props.onResize({ width: newWidth });
  }

  render() {
    const { width, minWidth, maxWidth, onResizeStart } = this.props;
    return (
      // EXPAND[可拓展拖拽吸附] snap: may be useful
      // EXPAND[可拓展多方向拉拽]
      // https://github.com/bokuweb/re-resizable

      <Resizable
  
        style={{ display: 'inline-block', border: '1px solid #ccc' }}
        enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}

        ref={c => this._resizable = c}
        minWidth={minWidth || DEFAULT_RANGE.minWidth}
        maxWidth={maxWidth || DEFAULT_RANGE.maxWidth}

        // size={{ width }}
        defaultSize={{ width }}
        onResize={this.handleResize}
        onResizeStart={onResizeStart}
      >
        {this.props.children}
      </Resizable>
    );
  }
}
