import {Piece, PieceType, Player} from '../piece/piece';

export function fulfillStartingPositionMap(): Map<string, Piece> {

  const positions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const map: Map<string, Piece> = new Map<string, Piece>();
  addWhitePlayerPieces(map, positions);
  addBlackPlayerPieces(map, positions);
  return map;
}


function addWhitePlayerPieces(map: Map<string, Piece>, positions: number[]) {
  for (const row of positions) {
    for (const column of positions) {
      if (shouldSquareHavePieceAtStart(row, column) && row < 4) {
        map.set(row.toString() + column.toString(), new Piece(PieceType.PAWN, Player.WHITE));
      }
    }
  }
}

function addBlackPlayerPieces(map: Map<string, Piece>, positions: number[]) {
  for (const row of positions) {
    for (const column of positions) {
      if (shouldSquareHavePieceAtStart(row, column) && row > 5) {
        map.set(row.toString() + column.toString(), new Piece(PieceType.PAWN, Player.BLACK));
      }
    }
  }
}

export function shouldSquareNotHavePieceAtStart(row: number, column: number) {
  return (column % 2 === 1 && row % 2 === 1) || (column % 2 === 0 && row % 2 === 0);
}

export function shouldSquareHavePieceAtStart(row: number, column: number) {
  return !shouldSquareNotHavePieceAtStart(row, column);
}
