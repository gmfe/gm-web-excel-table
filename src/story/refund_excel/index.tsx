

import React, { Component } from 'react'
import TabelExcelWrapper from './container';
import { LayoutRoot } from 'react-gm'

export default class TestComp extends Component<any, any> {
  render() {
    return (
      <div style={{ padding: 40 }}>
        <TabelExcelWrapper />
        <LayoutRoot />
      </div>
    )
  }
}
