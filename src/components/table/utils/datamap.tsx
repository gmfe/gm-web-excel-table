import { CellSelectedState } from '../constants';

export function RowcolIndextoSelectedState(rowIndex: number, colIndex: number): CellSelectedState {
  return { start: { i: rowIndex, j: colIndex }, end: { i: rowIndex, j: colIndex } }
}
