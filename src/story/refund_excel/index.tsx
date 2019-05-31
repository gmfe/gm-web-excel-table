

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
      i18next,
      onAddRow,
      rootStyle,
      onDeleteRow,
      hasLayoutRoot,
      columnContext,
      onSearchOrderName,
      onOrderNameChange,
      onClickSelectBatch,
      onReturnTotalPriceChange,
      onReturnOrderNumberChange,
      onReturnOrderPerPriceChange,
    } = this.props;
    return (
      <div style={rootStyle}>
        <TabelExcelWrapper
          data={data}
          i18next={i18next}
          loading={loading}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
          columnContext={columnContext}
          onSearchOrderName={onSearchOrderName}
          onOrderNameChange={onOrderNameChange}
          onClickSelectBatch={onClickSelectBatch}
          onReturnTotalPriceChange={onReturnTotalPriceChange}
          onReturnOrderNumberChange={onReturnOrderNumberChange}
          onReturnOrderPerPriceChange={onReturnOrderPerPriceChange}
        />
        { hasLayoutRoot ? <LayoutRoot /> : null }
      </div>
    )
  }
}
