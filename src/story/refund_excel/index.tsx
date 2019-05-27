

import React, { Component } from 'react'
import { LayoutRoot } from 'react-gm'
import TabelExcelWrapper from './container';
import { GMOrderListDataStructure } from './config';




export default class RefundExcelTable extends Component<{
  rootStyle?: object;
  onSearchOrderName: (value:string) => Promise<GMOrderListDataStructure[][]>
}, any> {

  static defaultProps = {
    rootStyle: {}
  }


  render() {
    const { rootStyle, onSearchOrderName } = this.props;
    return (
      <div style={rootStyle}>
        <TabelExcelWrapper
          onSearchOrderName={onSearchOrderName}
        />
        <LayoutRoot />
      </div>
    )
  }
}
