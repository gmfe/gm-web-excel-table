

import React, { Component } from 'react'

import TabelExcelWrapper from './container';

import { LayoutRoot } from 'react-gm'


export default class RefundExcelTable extends Component<any, any> {

  static defaultProps = {
    rootStyle: {}
  }


  render() {
    const {
      data,
      loading,
      context,
      onAddRow,
      rootStyle,
      onDeleteRow,
      hasLayoutRoot,
      onSearchOrderName,
      onOrderNameChange,
      onReturnTotalPriceChange,
      onReturnOrderNumberChange,
      onReturnOrderPerPriceChange,
    } = this.props;
    return (
      <div style={rootStyle}>
        <TabelExcelWrapper
          data={data}
          context={context}
          loading={loading}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
          onSearchOrderName={onSearchOrderName}
          onOrderNameChange={onOrderNameChange}
          onReturnTotalPriceChange={onReturnTotalPriceChange}
          onReturnOrderNumberChange={onReturnOrderNumberChange}
          onReturnOrderPerPriceChange={onReturnOrderPerPriceChange}
        />
        { hasLayoutRoot ? <LayoutRoot /> : null }
      </div>
    )
  }
}
