import { TableTransactionTypes } from '../constants/transactiontypes';
import { Transaction, ITransactionContext } from "kunsam-app-model";


export class EditCellTransaction extends Transaction {
  private _oldCell?: any;
  private _newCell?: any;
  public static uniqueType(): string {
    return TableTransactionTypes.editCell;
  }

  constructor(context: ITransactionContext) {
    super(context);
  }

  public onCommit(): any {
    const oldCell = this.context.args.oldCell;
    if (!oldCell) {
      return;
    }
    const newCell = this.context.args.newCell;
    if (!newCell) {
        return;
    }
    this._oldCell = JSON.stringify(oldCell);
    this._newCell = newCell;
    this.context.args.onChange(newCell);
  }

  public onUndo() {
    if (!this._oldCell || !this._newCell) {
      return;
    }
    const oldCell = JSON.parse(this._oldCell);
    this._oldCell = JSON.stringify(this._newCell);
    this._newCell = oldCell;
    this.context.args.onChange(this._newCell);
  }

  public onRedo() {
    if (!this._oldCell || !this._newCell) {
      return;
    }
    const oldCell = JSON.parse(this._oldCell);
    this._oldCell = JSON.stringify(this._newCell);
    this._newCell = oldCell;
    this.context.args.onChange(this._newCell);
  }
}

Transaction.registerTransactionFactory(EditCellTransaction.uniqueType(), {
  createTransaction(context: ITransactionContext): Transaction {
    return new EditCellTransaction(context);
  },
});