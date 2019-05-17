import { TableControllerKeyboardHanlder, MoveEditType } from "./interface";


export class TableControllerUtil {

  // 水平
  public static isInputSelectionArriveHorizonBoundary: boolean = false;

  // 竖直
  public static isInputSelectionArriveVerticalBoundary: boolean = false;

  /**
   * 锁住一次KeyUp，针对一些使用keyDown触发moveNextEdiableCell的场景
   *
   * @static
   * @type {boolean}
   * @memberof TableControllerUtil
   */
  public static lockAKeyup?: boolean = false;

  public static onInputKeyUp(e: React.KeyboardEvent, props: {
    value?: string,
    handler: TableControllerKeyboardHanlder,
    isCellOnFirstRow: () => boolean,
    isCellOnLastRow: () => boolean,
  }) {

    if (this.lockAKeyup) {
      this.lockAKeyup = false;
    }

    let { handler, value, isCellOnFirstRow, isCellOnLastRow } = props;
    const target = e.target as HTMLInputElement;
    const startPosition = target.selectionStart;
    const endPosition = target.selectionEnd;
  
    switch (e.key) {
      case 'ArrowRight': {
        if (!value) {
          handler.onKeyUp_ArrowRight();
        } else {
          const right = startPosition === endPosition && startPosition === value.length;
          if (right) {
            if (!this.isInputSelectionArriveHorizonBoundary) {
              this.isInputSelectionArriveHorizonBoundary = true;
            } else {
              handler.onKeyUp_ArrowRight();
            }
          } else {
            this.isInputSelectionArriveHorizonBoundary = false;
          }
        }
        break;
      }
      case 'ArrowLeft': {
        if (!value) {
          handler.onKeyUp_ArrowLeft();
        } else {
          const left = startPosition === 0 && endPosition === 0;
          if (left) {
            if (!this.isInputSelectionArriveHorizonBoundary) {
              this.isInputSelectionArriveHorizonBoundary = true;
            } else {
              handler.onKeyUp_ArrowLeft();
            }
          } else {
            this.isInputSelectionArriveHorizonBoundary = false;
          }
        }
        break;
      }
      case 'ArrowDown': {
        if (isCellOnLastRow()) {
          if (!this.isInputSelectionArriveVerticalBoundary) {
            this.isInputSelectionArriveVerticalBoundary = true;
          } else {
            handler.onKeyUp_ArrowDown();
          }
        } else {
          this.isInputSelectionArriveVerticalBoundary = false;
          handler.onKeyUp_ArrowDown();
        }
        break;
      }
      case 'ArrowUp': {
        if (isCellOnFirstRow()) {
          if (!this.isInputSelectionArriveVerticalBoundary) {
            this.isInputSelectionArriveVerticalBoundary = true;
          } else {
            handler.onKeyUp_ArrowUp();
          }
        } else {
          this.isInputSelectionArriveVerticalBoundary = false;
          handler.onKeyUp_ArrowUp();
        }
        break;
      }
      case 'Enter': {
        handler.moveToNextEditableCell(MoveEditType.enter);
        break;
      }
      default: {
        this.isInputSelectionArriveHorizonBoundary = false;
        this.isInputSelectionArriveVerticalBoundary = false;
      }
    }
  }
}