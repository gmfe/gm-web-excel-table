import "antd/dist/antd.less";
import "./styles.less";
import * as React from 'react';
import { App, SJAPP } from './client/app';
import * as ReactDOM from "react-dom";
import { AppBase } from './core/appbase';
import TableExcel from './components/table';


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
        <TableExcel app={this._app} />
      </div>
    );

  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<Root />, mountNode);