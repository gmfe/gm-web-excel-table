



import * as React from 'react';
import * as ReactDOM from "react-dom";
import RefundExcelTable from './refund_excel'
import { RefundExcelTable_AllData, GMOrderListDataStructure } from './refund_excel/interface';
import cloneDeep from 'lodash/cloneDeep'

var mountNode = document.getElementById("app");



// ----------------- 这个文件用来本地调试 -----------------


const MOCK_ALLDATA: RefundExcelTable_AllData = {
  type: 2,
  status: 1,
  details: [],
  discount: [],
  delta_money: 0,
  submit_time: "-",
  sku_money: "0.00",
  creator: "miaomiao",
  station_id: "T7936",
  batch_number: null,
  supplier_name: "蔬菜供应商",
  settle_supplier_id: "T11365",
  id: "T7936-JHTHD-2019-05-27-00001",
  date_time: "2019-05-27T10:35:37.004",
}

const defaultData = {
  name: '',
  money: '',
  std_unit: '',
  category: '',
  quantity: '',
  different_price: '',
  unit_price: '',
}

export default class RenderComp extends React.Component<any, {
  data: RefundExcelTable_AllData
  [key: string]: any
}> {

  constructor(props: any) {
    super(props);
    this.state = {
      data: MOCK_ALLDATA,
      change: 1,
      loading: false,
      authType: 1
    }
  }

  componentDidMount() {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({
        loading: false,
        data: {
          ...this.state.data,
          details: new Array(5).fill(null).map(a => cloneDeep(defaultData))
        }
      })

    }, 500)

    setTimeout(() => {
      this.setState({
        authType: 2
      })
    }, 3000)
  }
  

  fetchOrderName = (value: string, index: number) => {
    return new Promise<GMOrderListDataStructure[][]>(res => {


      setTimeout(() => {
        const mapData: GMOrderListDataStructure[][] = [
          new Array(15).fill(null).map(_ => ({
            label: Math.random().toFixed(3),
            children: [{
              std_unit: "件",
              value: "D4207755" + Math.random().toFixed(3),
              category: "调味酱汁类（液态）",
              unit_price: undefined,
              name: "海天草菇老抽 1.9L （件）" + Math.random().toFixed(3),
            }],
          }))
        ]
        res(mapData)
      }, 1000)
      // fetch('https://randomuser.me/api/?results=5')
      //   .then(response => response.json())
      //   .then(body => {
      //     const data = body.results.map((user: any) => ({
      //       text: `${user.name.first} ${user.name.last} ${value}`,
      //       value: `${user.name.first} ${user.name.last}`,
      //     }));
      //     console.log(data, value, 'valuevaluevaluevalue')
      //     res(data)
      //   });
    })
  }

  onSelectOrderName = (selectedData: any, index: number) => {
    const details = this.state.data.details;
    details[index] = Object.assign(details[index] || {}, selectedData)
    this.setState({
      data: {
        ...this.state.data,
        details,
      }
    });
  }

  onReturnOrderNumberChange = (value: string, index: number) => {
    const details = this.state.data.details;
    details[index].quantity = value;
    this.setState({
      data: {
        ...this.state.data,
        details,
      }
    });
  }

  onReturnOrderPerPriceChange = (value: string, index: number) => {
    const details = this.state.data.details;
    details[index].unit_price = value;
    this.setState({
      data: {
        ...this.state.data,
        details,
      }
    });
  }

  onReturnTotalPriceChange = (value: string, index: number) => {
    const details = this.state.data.details;
    details[index].money = value;
    this.setState({
      data: {
        ...this.state.data,
        details,
      }
    });
  }

  onAddRow = (data: any, index: number) => {
    const details = this.state.data.details;
    if (index !== undefined) {
      details.splice(index, 0, cloneDeep(defaultData))
    } else {
      details.push(cloneDeep(defaultData));
    }
    this.setState({
      data: {
        ...this.state.data,
        details,
      }
    });
  }

  onDeleteRow = (rowIndex: number) => {
    console.log(rowIndex, 'onDeleteRowonDeleteRow')
    const details = this.state.data.details;
    details.splice(rowIndex, 1);
    this.setState({
      data: {
        ...this.state.data,
        details,
      }
    });
  }

  render() {
    const { data, loading, authType } = this.state;
    return (
      <div >
        <RefundExcelTable
          data={data}
          hasLayoutRoot
          loading={loading}
          context={{ authType }}

          rootStyle={{ padding: 40 }}
          onAddRow={this.onAddRow}
          onDeleteRow={this.onDeleteRow}
          onSearchOrderName={this.fetchOrderName}
          onOrderNameChange={this.onSelectOrderName}
          onReturnOrderNumberChange={this.onReturnOrderNumberChange}
          onReturnOrderPerPriceChange={this.onReturnOrderPerPriceChange}
          onReturnTotalPriceChange={this.onReturnTotalPriceChange}
        />
      </div>

    )
  }
}



ReactDOM.render(<RenderComp />, mountNode);

