



import * as React from 'react';
import * as ReactDOM from "react-dom";

import RefundExcelTable from './refund_excel'
import { GMOrderListDataStructure } from './refund_excel/config';
var mountNode = document.getElementById("app");



export default class RenderComp extends React.Component<any, any> {

  fetchOrderName = (value: string) => {
    return new Promise<GMOrderListDataStructure[][]>(res => {
      fetch('https://randomuser.me/api/?results=5')
        .then(response => response.json())
        .then(body => {
          const data = body.results.map((user: any) => ({
            text: `${user.name.first} ${user.name.last} ${value}`,
            value: `${user.name.first} ${user.name.last}`,
          }));

          const mapData: GMOrderListDataStructure[][] = [
            [{
              label: 'x', children: [{
                std_unit: "件",
                value: "D4207755",
                category: "调味酱汁类（液态）",
                unit_price: undefined,
                name: "海天草菇老抽 1.9L （件）",
              }]
            }],
          ]

          res(mapData)
        });
    })

  }

  render() {
    return (
      <RefundExcelTable
        rootStyle={{ padding: 40 }}
        onSearchOrderName={this.fetchOrderName}
      />
    )
  }
}



ReactDOM.render(<RenderComp />, mountNode);

