import * as React from 'react'

import {
  TableControllerInterface, CellUniqueObject, MoveEditType,
} from './interface';
import { TableControllerUtil } from './tabelcontroller-util';




export function WithKeyboardHandler(Target: React.ComponentClass<any, any>) {

  return class extends React.Component<{
    [key: string]: any;
    cell: CellUniqueObject
    tableController: TableControllerInterface
  }, any>  {


    render() {
      const { tableController, cell } = this.props;
      return (
        <Target
          {...this.props}
          handleKeyUp={(e: React.KeyboardEvent, value?: string | number) => {
            e.preventDefault();
            TableControllerUtil.onInputKeyUp(e,{
                value: `${value}`,
                handler: {
                  onKeyUp_ArrowUp: () => {
                    tableController.move.moveToPreviousRowEditableCell(MoveEditType.arrow, cell);
                  },
                  onKeyUp_ArrowDown: () => {
                    tableController.move.moveToNextRowEditableCell(MoveEditType.arrow, cell);
                  },
                  onKeyUp_ArrowLeft: () => {
                    tableController.move.moveToPreviousEditableCell(MoveEditType.arrow, cell);
                  },
                  onKeyUp_ArrowRight: () => {
                    tableController.move.moveToNextEditableCell(MoveEditType.arrow, cell);
                  },
                },
                isCellOnFirstRow: () => tableController.query.isCellOnFirstRow(cell),
                isCellOnLastRow: () => tableController.query.isCellOnLastRow(cell),
              },
            );
          }}
        />
      )
    }
  }


}
