import "antd/dist/antd.less";
import "./styles.less";
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { AppBase } from './core/appbase';
import { App, SJAPP } from './client/app';
import { OrderTable1 } from "./components/ordertable1/ordertable1";


class Root extends React.Component<{}> {
  private _app: AppBase = App;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    // project only init an app model
    (this._app as SJAPP).run();
  }

  render() {
    return (
      <div>
        Hello
        <OrderTable1 app={this._app} />
      </div>
    );

  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<Root />, mountNode);