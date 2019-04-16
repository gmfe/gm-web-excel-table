import { TableTransactionTypes } from './../constants/transactiontypes';
import { Transaction, ITransactionContext } from "../../../core/transaction/transaction";



export class EditCellTransaction extends Transaction {
  private _cell?: any;
  private _data?: any;
  public static uniqueType(): string {
    return TableTransactionTypes.editCell;
  }

  constructor(context: ITransactionContext) {
    super(context);
  }

  public onCommit(): any {
    this._cell = this.context.args.cell;
    if (!this._cell) {
      return;
    }
    const data = this.context.args.data;
    if (!data) {
        return;
    }
    this._data = this._cell.amount;
    this._cell.amount = data;
    this.context.args.onChange(this._cell, this.context.args.index);
    // console.log(this.context, data, this._cell, 'onCommitonCommit')
  }

  public onUndo() {
    if (!this._cell || !this._data) {
      return;
    }
    const data = this._data;
    this._data = this._cell.amount;
    this._cell.amount = data;
    this.context.args.onChange(this._cell, this.context.args.index);
    console.log(this, 'undo onUndo 3 amountamount')
  }

  public onRedo() {
    if (!this._cell || !this._data) {
      return;
    }
    const data = this._data;
    this._data = this._cell.amount;
    this._cell.amount = data;
    this.context.args.onChange(this._cell, this.context.args.index);
  }
}

Transaction.registerTransactionFactory(EditCellTransaction.uniqueType(), {
  createTransaction(context: ITransactionContext): Transaction {
    return new EditCellTransaction(context);
  },
});