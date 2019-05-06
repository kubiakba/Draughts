import {Piece, PiecePosition, Position} from '../piece/piece';
import {PossiblePositions} from './board.mover.calculator';
import {handleBeating} from './board.beating.calculator';
import {getPieceByPosition, isPositionInBoard} from './board.calculator';

export type ChangeValue = (input: number) => number;
export const MAX_ROW = 9;
export const MIN_ROW = 0;

export function incrementValue(input: number): number {
  return input + 1;
}

export function decrementValue(input: number): number {
  return input - 1;
}

export function createPossiblePositions(currentPosition: PiecePosition, changeValueForRow: ChangeValue, changeValueForColumn: ChangeValue, edgeRow: number): Position[] {
  const positions: Position[] = [];
  let column = currentPosition.position.column;
  if (edgeRow === MIN_ROW) {
    for (let i = currentPosition.position.row; i > edgeRow; i = changeValueForRow(i)) {
      const position = new Position(i, column);
      if (isPositionInBoard(position)) {
        positions.push(position);
      }
      column = changeValueForColumn(column);
    }
  } else {
    for (let i = currentPosition.position.row; i < edgeRow; i = changeValueForRow(i)) {
      const position = new Position(i, column);
      if (isPositionInBoard(position)) {
        positions.push(position);
      }
      column = changeValueForColumn(column);
    }
  }
  return positions;
}

function addFirstBeatingPosition(possibleDamePositions: Position[], positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions, rowChange: number, columnChange: number) {
  const firstBeatableDamePosition = new PossiblePositions();
  Array.from(possibleDamePositions)
    .filter(damePosition => !!!getPieceByPosition(positions, damePosition).piece || (damePosition.row === currentPosition.position.row))
    .map(damePosition => {
      const piece = getPieceByPosition(positions, currentPosition.position);
      piece.position = damePosition as Position;
      handleBeating(positions, piece, firstBeatableDamePosition, rowChange, columnChange);
    });
  if (firstBeatableDamePosition.beatablePositions.length > 0) {
    possiblePositions.beatablePositions.push(firstBeatableDamePosition.beatablePositions[0]);
  }
}

function handleContinuousIncRowIncColumnBeating(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions: Position[] = createPossiblePositions(currentPosition, incrementValue, incrementValue, MAX_ROW);
  addFirstBeatingPosition(possibleDamePositions, positions, currentPosition, possiblePositions, 1, 1);
}

function handleContinuousIncRowDecColumnBeating(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, incrementValue, decrementValue, MAX_ROW);
  addFirstBeatingPosition(possibleDamePositions, positions, currentPosition, possiblePositions, 1, -1);
}

function handleContinuousDecRowIncColumnBeating(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, decrementValue, incrementValue, MIN_ROW);
  addFirstBeatingPosition(possibleDamePositions, positions, currentPosition, possiblePositions, -1, 1);
}

function handleContinuousDecRowDecColumnBeating(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, decrementValue, decrementValue, MIN_ROW);
  addFirstBeatingPosition(possibleDamePositions, positions, currentPosition, possiblePositions, -1, -1);
}

export function handleBeatingPossibleMovesForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handleContinuousIncRowIncColumnBeating(positions, currentPosition, possiblePositions);
  handleContinuousIncRowDecColumnBeating(positions, currentPosition, possiblePositions);
  handleContinuousDecRowIncColumnBeating(positions, currentPosition, possiblePositions);
  handleContinuousDecRowDecColumnBeating(positions, currentPosition, possiblePositions);
}
