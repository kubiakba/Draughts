import {Piece, PiecePosition, PieceType, Player, Position} from '../piece/piece';
import * as _ from 'underscore';

export function getPieceByPosition(positions: Map<Position, Piece>, position: Position): PiecePosition {
  const piece = positions.get(getPositionFromMap(positions, position));
  return new PiecePosition(position, piece);
}

export function setNewPieceByPosition(positions: Map<Position, Piece>, oldPosition: Position, newPosition: Position): PiecePosition {
  const oldPiecePosition = getPieceByPosition(positions, oldPosition);
  if (newPosition.row === 8 && oldPiecePosition.piece.owner === Player.WHITE) {
    return new PiecePosition(newPosition, new Piece(PieceType.DAME, Player.WHITE));
  } else if (newPosition.row === 1 && oldPiecePosition.piece.owner === Player.BLACK) {
    return new PiecePosition(newPosition, new Piece(PieceType.DAME, Player.BLACK));
  }
  return new PiecePosition(newPosition, getPieceByPosition(positions, oldPosition).piece);
}

export function changePosition(position: Position, rowChange: number, columnChange: number): Position {
  const row = position.row + rowChange;
  const column = position.column + columnChange;
  return new Position(row, column);
}

export function isPositionInBoard(position: Position): boolean {
  const row = position.row;
  const column = position.column;
  return (row < 9 && row > 0 && column > 0 && column < 9);
}

export function isMoveBeatable(lastClickedPosition: Position, currentPosition: Position, map: Map<Position, Piece>): boolean {
  return !!getPieceInMiddlePosition(lastClickedPosition, currentPosition, map);
}

export function getPositionFromMap(map: Map<Position, Piece>, position: Position): Position {
  return Array.from(map.keys()).find(key => _.isEqual(key, position)) as Position;
}

export function getPositionFromArray(positions: Position[], position: Position) {
  return positions.find(key => _.isEqual(key, position));
}

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
  } else if (lastClickedPosition.row > currentPosition.row && lastClickedPosition.column < currentPosition.column) {
    for (let index = 1; index < lastClickedPosition.row - currentPosition.row; index++) {
      const position: Position = new Position(lastClickedPosition.row - index, lastClickedPosition.column + index);
      const pieceInMiddle = getPieceByPosition(map, position);
      if (arePieceOwnersDifferent(pieceInMiddle, lastClickedPiece)) {
        return position;
      }
    }
  } else if (lastClickedPosition.row < currentPosition.row && lastClickedPosition.column > currentPosition.column) {
    for (let index = 1; index < currentPosition.row - lastClickedPosition.row; index++) {
      const position: Position = new Position(lastClickedPosition.row + index, lastClickedPosition.column - index);
      const pieceInMiddle = getPieceByPosition(map, position);
      if (arePieceOwnersDifferent(pieceInMiddle, lastClickedPiece)) {
        return position;
      }
    }
  } else if (lastClickedPosition.row < currentPosition.row && lastClickedPosition.column < currentPosition.column) {
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

export class PossiblePositions {
  positions: Position[] = [];
  beatablePositions: Position[] = [];
}
