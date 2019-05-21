import * as React from 'react'

import {
  TableControllerInterface, CellUniqueObject, MoveEditType,
} from './interface';
import { TableControllerUtil } from './tabelcontroller-util';


export interface WithKeyboardHandlerProviderProps {
  handleKeyUp: (e: React.KeyboardEvent, value?: string | number) => void;
  moveToNextEditableCell: (type: MoveEditType) => void;
  onInputFocus: (...args: any[]) => void;
}


/**
 * 对于需要响应键盘操作的输入框 统一注入处理 keyUp 函数
 *
 * @export
 * @param {React.ComponentClass<any, any>} Target
 * @returns
 */
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
          onInputFocus={() => {
            tableController.edit(cell);
          }}
          handleKeyUp={(e: React.KeyboardEvent, value?: string | number) => {
            // e.preventDefault();
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
                  moveToNextEditableCell: (type: MoveEditType) => {
                    tableController.move.moveToNextEditableCell(type, cell);
                  }
                },
                isCellOnFirstRow: () => tableController.query.isCellOnFirstRow(cell),
                isCellOnLastRow: () => tableController.query.isCellOnLastRow(cell),
              },
            );
          }}
          moveToNextEditableCell={(type: MoveEditType) => {
            tableController.move.moveToNextEditableCell(type, cell);
          }}
        />
      )
    }
  }


}