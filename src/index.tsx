import "antd/dist/antd.less";
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { OrderTable1 } from './components/ordertable1/ordertable1';

export * from './components'

// 看看业务需要什么常量



var mountNode = document.getElementById("app");
ReactDOM.render(<OrderTable1 />, mountNode);