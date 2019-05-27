

import React, { Component } from 'react'
import TabelExcelWrapper from './container';
import { LayoutRoot } from 'react-gm'

export default class RefundExcelTable extends Component<{
  rootStyle?: object;
  onSearchOrderName: (value:string) => Promise<any>
}, any> {

  static defaultProps = {
    rootStyle: {}
  }

  render() {
    const { rootStyle, onSearchOrderName } = this.props;
    return (
      <div style={rootStyle}>
        <TabelExcelWrapper onSearchOrderName={onSearchOrderName} />
        <LayoutRoot />
      </div>
    )
  }
}
