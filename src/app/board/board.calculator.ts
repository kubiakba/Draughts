import {Piece, PiecePosition, Player} from '../piece/piece';

export function calculatePossiblePositions(positions: Map<string, Piece>, activePlayer: Player, actualPosition: PiecePosition): string[] {
  const possiblePositions: string[] = [];
  if (actualPosition.piece.owner === Player.WHITE) {
    addPossiblePositionsForWhite(positions, actualPosition, possiblePositions);
  }
  return possiblePositions;
}

function addPossiblePositionsForWhite(positions: Map<string, Piece>, actualPosition: PiecePosition, possiblePositions: string[]) {
  if (!positions.get(incrementRowAndColumn(actualPosition.position))) {
    possiblePositions.push(incrementRowAndColumn(actualPosition.position));
  }
  if (!positions.get(incrementRowAndDecrementColumn(actualPosition.position))) {
    possiblePositions.push(incrementRowAndDecrementColumn(actualPosition.position));
  }
}

function incrementRowAndColumn(position: string): string {
  // todo check if position is in board
  const positions = position.split('');
  const row = +positions[0] + 1;
  const column = +positions[1] + 1;
  return row.toString() + column.toString();
}

function incrementRowAndDecrementColumn(position: string): string {
  // todo check if position is in board
  const positions = position.split('');
  const row = +positions[0] + 1;
  const column = +positions[1] - 1;
  return row.toString() + column.toString();
}

export function getPieceByPosition(positions: Map<string, Piece>, position: string): PiecePosition {
  return new PiecePosition(position, positions.get(position));
}
