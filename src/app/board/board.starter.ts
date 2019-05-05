import {Piece, PieceType, Player, Position} from '../piece/piece';

export function fulfillStartingPositionMap(): Map<Position, Piece> {
  const positions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const map: Map<Position, Piece> = new Map<Position, Piece>();
  addWhitePlayerPieces(map, positions);
  addBlackPlayerPieces(map, positions);
  return map;
}

function addWhitePlayerPieces(map: Map<Position, Piece>, positions: number[]) {
  for (const row of positions) {
    for (const column of positions) {
      if (shouldSquareHavePieceAtStart(new Position(row, column)) && row < 4) {
        map.set(new Position(row, column), new Piece(PieceType.PAWN, Player.WHITE));
      }
    }
  }
}

function addBlackPlayerPieces(map: Map<Position, Piece>, positions: number[]) {
  for (const row of positions) {
    for (const column of positions) {
      if (shouldSquareHavePieceAtStart(new Position(row, column)) && row > 5) {
        map.set(new Position(row, column), new Piece(PieceType.PAWN, Player.BLACK));
      }
    }
  }
}

export function shouldSquareNotHavePieceAtStart(position: Position) {
  return (position.column % 2 === 1 && position.row % 2 === 1) || (position.column % 2 === 0 && position.row % 2 === 0);
}

export function shouldSquareHavePieceAtStart(position: Position) {
  return !shouldSquareNotHavePieceAtStart(position);
}
