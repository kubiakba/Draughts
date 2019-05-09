import {Piece, PiecePosition, Position} from '../piece/piece';
import {PossiblePositions} from './board.mover.calculator';
import {ChangeValue, createPossiblePositions, decrementValue, incrementValue, MAX_ROW, MIN_ROW} from './board.dame.possible.beating.moves';
import {getPieceByPosition} from './board.calculator';

function addAllPositionsIfNoObstacleOccur(possibleDamePositions: Position[], possiblePositions: PossiblePositions) {
  Array.from(possibleDamePositions).forEach(position => {
    possiblePositions.positions.push(position);
  });
}

function addPositionsIncrementingRows(possibleDamePositions: Position[], firstObstacle, possiblePositions: PossiblePositions) {
  Array.from(possibleDamePositions).filter(position => position.row < firstObstacle.row).forEach(position => {
    possiblePositions.positions.push(position);
  });
}

function addPositionsDecrementingRows(possibleDamePositions: Position[], firstObstacle, possiblePositions: PossiblePositions) {
  Array.from(possibleDamePositions).filter(position => position.row > firstObstacle.row).forEach(position => {
    possiblePositions.positions.push(position);
  });
}

function filterPossibleDamePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition, possibleDamePositions: Position[], possiblePositions: PossiblePositions) {
  if (possibleDamePositions.length > 0) {
    const firstObstacle = possibleDamePositions.find(position => !!getPieceByPosition(positions, position).piece);
    if (firstObstacle) {
      if (currentPosition.position.row < possibleDamePositions[0].row) {
        addPositionsIncrementingRows(possibleDamePositions, firstObstacle, possiblePositions);
      } else {
        addPositionsDecrementingRows(possibleDamePositions, firstObstacle, possiblePositions);
      }
    } else {
      addAllPositionsIfNoObstacleOccur(possibleDamePositions, possiblePositions);
    }
  }
}

function removeCurrentPosition(possibleDamePositions: Position[], currentPosition: PiecePosition) {
  return Array
    .from(possibleDamePositions)
    .filter(position => position.column !== currentPosition.position.column && position.row !== currentPosition.position.row);
}

function addPossibleDamePositions(currentPosition: PiecePosition, positions: Map<Position, Piece>, possiblePositions: PossiblePositions, changeValueForRow: ChangeValue, changeValueForColumn: ChangeValue, edgeRow: number) {
  const possibleDamePositions = createPossiblePositions(currentPosition, changeValueForRow, changeValueForColumn, edgeRow);
  const possibleDamePositionsWithoutCurrentPosition = removeCurrentPosition(possibleDamePositions, currentPosition);
  filterPossibleDamePositions(positions, currentPosition, possibleDamePositionsWithoutCurrentPosition, possiblePositions);
}

function calculateContinuousIncRowIncColumnDamePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  addPossibleDamePositions(currentPosition, positions, possiblePositions, incrementValue, incrementValue, MAX_ROW);
}

function calculateContinuousIncRowDecColumnDamePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  addPossibleDamePositions(currentPosition, positions, possiblePositions, incrementValue, decrementValue, MAX_ROW);
}

function calculateContinuousDecRowIncColumnDamePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  addPossibleDamePositions(currentPosition, positions, possiblePositions, decrementValue, incrementValue, MIN_ROW);
}

function calculateContinuousDecRowDecColumnDamePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  addPossibleDamePositions(currentPosition, positions, possiblePositions, decrementValue, decrementValue, MIN_ROW);
}

export function handlePossibleMovesForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  calculateContinuousIncRowIncColumnDamePositions(positions, currentPosition, possiblePositions);
  calculateContinuousIncRowDecColumnDamePositions(positions, currentPosition, possiblePositions);
  calculateContinuousDecRowIncColumnDamePositions(positions, currentPosition, possiblePositions);
  calculateContinuousDecRowDecColumnDamePositions(positions, currentPosition, possiblePositions);
}
