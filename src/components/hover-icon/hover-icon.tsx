

import React, { Component } from 'react'


export default class HoverIcon extends Component<any, any> {

  state = {
    hoverd: false,
  }

  render() {
    const { Placeholder, Hover, ...containerProps } = this.props;
    return (
      <div
        {...containerProps}
        onMouseEnter={() => { this.setState({ hoverd: true }) }}
        onMouseLeave={() => { this.setState({ hoverd: false }) }}
      >
        { this.state.hoverd ? <Hover /> : <Placeholder /> }
      </div>
    )
  }
}
