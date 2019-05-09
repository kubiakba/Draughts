import {Piece, PiecePosition, Position} from '../piece/piece';
import {handleBeating} from './board.beating.calculator';
import {getPieceByPosition, isPositionInBoard, PossiblePositions} from './board.calculator';

export type ChangeValue = (input: number) => number;
export const MAX_ROW = 9;
export const MIN_ROW = 0;

export function incrementValue(input: number): number {
  return input + 1;
}

export function decrementValue(input: number): number {
  return input - 1;
}

function addPosition(row: number, column: number, positions: Position[]) {
  const position = new Position(row, column);
  if (isPositionInBoard(position)) {
    positions.push(position);
  }
}

export function createPossiblePositions(currentPosition: PiecePosition, changeValueForRow: ChangeValue, changeValueForColumn: ChangeValue, edgeRow: number): Position[] {
  const positions: Position[] = [];
  let column = currentPosition.position.column;
  if (edgeRow === MIN_ROW) {
    for (let i = currentPosition.position.row; i > edgeRow; i = changeValueForRow(i)) {
      addPosition(i, column, positions);
      column = changeValueForColumn(column);
    }
  } else if (edgeRow === MAX_ROW) {
    for (let i = currentPosition.position.row; i < edgeRow; i = changeValueForRow(i)) {
      addPosition(i, column, positions);
      column = changeValueForColumn(column);
    }
  }
  return positions;
}

function isNoPieceOnPosition(positions: Map<Position, Piece>, damePosition, currentPosition: PiecePosition) {
  return !!!getPieceByPosition(positions, damePosition).piece || (damePosition.row === currentPosition.position.row);
}

function createPieceWithNewPosition(positions: Map<Position, Piece>, currentPosition: PiecePosition, damePosition: Position) {
  const piece = getPieceByPosition(positions, currentPosition.position);
  return new PiecePosition(damePosition, piece.piece);
}

function addFirstBeatingPositionForDame(possibleDamePositions: Position[], positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions, rowChange: number, columnChange: number) {
  const firstBeatableDamePosition = new PossiblePositions();
  Array.from(possibleDamePositions)
    .filter(damePosition => isNoPieceOnPosition(positions, damePosition, currentPosition))
    .forEach(damePosition => {
      const piece = createPieceWithNewPosition(positions, currentPosition, damePosition);
      handleBeating(positions, piece, firstBeatableDamePosition, rowChange, columnChange);
    });
  if (firstBeatableDamePosition.beatablePositions.length > 0) {
    possiblePositions.beatablePositions.push(firstBeatableDamePosition.beatablePositions[0]);
  }
}

function handleContinuousIncRowIncColumnBeatingForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions: Position[] = createPossiblePositions(currentPosition, incrementValue, incrementValue, MAX_ROW);
  addFirstBeatingPositionForDame(possibleDamePositions, positions, currentPosition, possiblePositions, 1, 1);
}

function handleContinuousIncRowDecColumnBeatingForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, incrementValue, decrementValue, MAX_ROW);
  addFirstBeatingPositionForDame(possibleDamePositions, positions, currentPosition, possiblePositions, 1, -1);
}

function handleContinuousDecRowIncColumnBeatingForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, decrementValue, incrementValue, MIN_ROW);
  addFirstBeatingPositionForDame(possibleDamePositions, positions, currentPosition, possiblePositions, -1, 1);
}

function handleContinuousDecRowDecColumnBeatingForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, decrementValue, decrementValue, MIN_ROW);
  addFirstBeatingPositionForDame(possibleDamePositions, positions, currentPosition, possiblePositions, -1, -1);
}

export function handleBeatingPossibleMovesForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handleContinuousIncRowIncColumnBeatingForDame(positions, currentPosition, possiblePositions);
  handleContinuousIncRowDecColumnBeatingForDame(positions, currentPosition, possiblePositions);
  handleContinuousDecRowIncColumnBeatingForDame(positions, currentPosition, possiblePositions);
  handleContinuousDecRowDecColumnBeatingForDame(positions, currentPosition, possiblePositions);
}
