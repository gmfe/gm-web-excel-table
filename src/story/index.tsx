



import * as React from 'react';
import * as ReactDOM from "react-dom";

import RefundExcelTable from './refund_excel'
var mountNode = document.getElementById("app");


const fetchOrderName = (value: string) => new Promise((res) => {
  fetch('https://randomuser.me/api/?results=5')
    .then(response => response.json())
    .then(body => {
      const data = body.results.map((user: any) => ({
        text: `${user.name.first} ${user.name.last} ${value}`,
        value: `${user.name.first} ${user.name.last}`,
      }));
      res([{ label: 'x', children: data }]);
    });
})

ReactDOM.render(<RefundExcelTable
  rootStyle={{ padding: 40 }}
  onSearchOrderName={fetchOrderName}
/>, mountNode);

