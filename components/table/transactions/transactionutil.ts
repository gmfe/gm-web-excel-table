
import { EditCellTransaction } from './editcelltransactions';
import { TableTransactionTypes } from '../constants/transactiontypes';
import { AppBase, Transaction, Transaction, GroupTransaction, ITransactionContext, CoreConstants } from 'kunsam-app-model';



export class TableTransactionUtil{

  public static createGroupTransaction(app: AppBase) {
    const groupTransaction = Transaction.createTransaction(CoreConstants.TransactionTypes.Group, { app: app, args: {} }) as GroupTransaction;
    return groupTransaction;
}

  public static createEditCellTransaction(app: AppBase, oldCell: any, newCell: any, onChange: Function, groupTransaction: GroupTransaction) {
    if (!Transaction.isTransactionFactoryAvailable(TableTransactionTypes.editCell)) {
      Transaction.registerTransactionFactory(EditCellTransaction.uniqueType(), {
        createTransaction(context: ITransactionContext): Transaction {
          return new EditCellTransaction(context);
        },
      });
    }
    const transaction = Transaction.createTransaction(
      TableTransactionTypes.editCell,
      { app, args: { oldCell, newCell, onChange }},
    );
    if (transaction) {
      groupTransaction.add(transaction);
    }
  }
}