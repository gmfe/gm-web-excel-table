import { TableControllerKeyboardHanlder } from "./interface";


export class TableControllerUtil {

  // 水平
  public static isInputSelectionArriveHorizonBoundary: boolean = false;

  // 竖直
  public static isInputSelectionArriveVerticalBoundary: boolean = false;

  public static onInputKeyUp(e: React.KeyboardEvent, props: {
    value?: string,
    handler: TableControllerKeyboardHanlder,
    isCellOnFirstRow: () => boolean,
    isCellOnLastRow: () => boolean,
  }) {
    let { handler, value, isCellOnFirstRow, isCellOnLastRow } = props;
    const target = e.target as HTMLInputElement;
    const startPosition = target.selectionStart;
    const endPosition = target.selectionEnd;
    let isMove = false;
    if (value) {
      const left = startPosition === 0 && endPosition === 0;
      const right = startPosition === endPosition && startPosition === value.length;
      if (left || right) {
        if (!TableControllerUtil.isInputSelectionArriveHorizonBoundary) {
          TableControllerUtil.isInputSelectionArriveHorizonBoundary = true;
        } else {
          isMove = true;
        }
      } else {
        TableControllerUtil.isInputSelectionArriveHorizonBoundary = false;
      }
    } else {
      isMove = true;
      TableControllerUtil.isInputSelectionArriveHorizonBoundary = false;
    }
  
    switch (e.key) {
      case 'ArrowRight': {
        if (isMove) {
          handler.onKeyUp_ArrowRight();
        }
        break;
      }
      case 'ArrowLeft': {
        if (isMove) {
          handler.onKeyUp_ArrowLeft();
        }
        break;
      }
      case 'ArrowDown': {
        if (isCellOnLastRow()) {
          if (!TableControllerUtil.isInputSelectionArriveVerticalBoundary) {
            TableControllerUtil.isInputSelectionArriveVerticalBoundary = true;
          } else {
            handler.onKeyUp_ArrowDown();
          }
        } else {
          TableControllerUtil.isInputSelectionArriveVerticalBoundary = false;
          handler.onKeyUp_ArrowDown();
        }
        break;
      }
      case 'ArrowUp': {
        if (isCellOnFirstRow()) {
          if (!TableControllerUtil.isInputSelectionArriveVerticalBoundary) {
            TableControllerUtil.isInputSelectionArriveVerticalBoundary = true;
          } else {
            handler.onKeyUp_ArrowUp();
          }
        } else {
          TableControllerUtil.isInputSelectionArriveVerticalBoundary = false;
          handler.onKeyUp_ArrowUp();
        }
        break;
      }
      case 'Enter': {
        // movetoNext
        console.log('EnterEnterEnterEnter')
        break;
      }
      default: {
        TableControllerUtil.isInputSelectionArriveHorizonBoundary = false;
        TableControllerUtil.isInputSelectionArriveVerticalBoundary = false;
      }
    }
  }
}