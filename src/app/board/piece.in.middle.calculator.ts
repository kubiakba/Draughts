import {Piece, PiecePosition, Position} from '../piece/piece';
import {getPieceByPosition} from './board.calculator';

export function getPieceInMiddlePosition(lastClickedPosition: Position, currentPosition: Position, map: Map<Position, Piece>): Position {
  const lastClickedPiece = getPieceByPosition(map, lastClickedPosition);
  if (lastClickedPosition.row > currentPosition.row && lastClickedPosition.column > currentPosition.column) {
    for (let index = 1; index < lastClickedPosition.row - currentPosition.row; index++) {
      const position: Position = new Position(lastClickedPosition.row - index, lastClickedPosition.column - index);
      const pieceInMiddle = getPieceByPosition(map, position);
      if (arePieceOwnersDifferent(pieceInMiddle, lastClickedPiece)) {
        return position;
      }
    }
  }
  if (lastClickedPosition.row > currentPosition.row && lastClickedPosition.column < currentPosition.column) {
    for (let index = 1; index < lastClickedPosition.row - currentPosition.row; index++) {
      const position: Position = new Position(lastClickedPosition.row - index, lastClickedPosition.column + index);
      const pieceInMiddle = getPieceByPosition(map, position);
      if (arePieceOwnersDifferent(pieceInMiddle, lastClickedPiece)) {
        return position;
      }
    }
  }
  if (lastClickedPosition.row < currentPosition.row && lastClickedPosition.column > currentPosition.column) {
    for (let index = 1; index < currentPosition.row - lastClickedPosition.row; index++) {
      const position: Position = new Position(lastClickedPosition.row + index, lastClickedPosition.column - index);
      const pieceInMiddle = getPieceByPosition(map, position);
      if (arePieceOwnersDifferent(pieceInMiddle, lastClickedPiece)) {
        return position;
      }
    }
  }
  if (lastClickedPosition.row < currentPosition.row && lastClickedPosition.column < currentPosition.column) {
    for (let index = 1; index < currentPosition.row - lastClickedPosition.row; index++) {
      const position: Position = new Position(lastClickedPosition.row + index, lastClickedPosition.column + index);
      const pieceInMiddle = getPieceByPosition(map, position);
      if (arePieceOwnersDifferent(pieceInMiddle, lastClickedPiece)) {
        return position;
      }
    }

  }
}

function arePieceOwnersDifferent(pieceInMiddle: PiecePosition, lastClickedPiece: PiecePosition) {
  return !!pieceInMiddle.piece && pieceInMiddle.piece.owner !== lastClickedPiece.piece.owner;
}
