import {Piece, PiecePosition, Position} from '../piece/piece';
import {PossiblePositions} from './board.mover.calculator';
import {createPossiblePositions, decrementValue, incrementValue, MAX_ROW, MIN_ROW} from './board.dame.possible.beating.moves';
import {getPieceByPosition} from './board.calculator';

function filterPossiblePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition, possibleDamePositionsWithoutCurrentPosition: Position[], possiblePositions: PossiblePositions) {
  if (possibleDamePositionsWithoutCurrentPosition.length > 0) {
    const firstObstacle = possibleDamePositionsWithoutCurrentPosition
      .find(position => !!getPieceByPosition(positions, position).piece);
    if (firstObstacle) {
      if (currentPosition.position.row < possibleDamePositionsWithoutCurrentPosition[0].row) {
        Array.from(possibleDamePositionsWithoutCurrentPosition).filter(position => position.row < firstObstacle.row).forEach(position => {
          possiblePositions.positions.push(position);
        });
      } else {
        Array.from(possibleDamePositionsWithoutCurrentPosition).filter(position => position.row > firstObstacle.row).forEach(position => {
          possiblePositions.positions.push(position);
        });
      }
    } else {
      Array.from(possibleDamePositionsWithoutCurrentPosition).forEach(position => {
        possiblePositions.positions.push(position);
      });
    }
  }
}

function handleContinuousIncRowIncColumn(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, incrementValue, incrementValue, MAX_ROW);
  const possibleDamePositionsWithoutCurrentPosition = Array.from(possibleDamePositions)
    .filter(position => position.column !== currentPosition.position.column && position.row !== currentPosition.position.row);
  filterPossiblePositions(positions, currentPosition, possibleDamePositionsWithoutCurrentPosition, possiblePositions);
}


function handleContinuousIncRowDecColumn(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, incrementValue, decrementValue, MAX_ROW);
  const possibleDamePositionsWithoutCurrentPosition = Array.from(possibleDamePositions)
    .filter(position => position.column !== currentPosition.position.column && position.row !== currentPosition.position.row);
  filterPossiblePositions(positions, currentPosition, possibleDamePositionsWithoutCurrentPosition, possiblePositions);

}

function handleContinuousDecRowIncColumn(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, decrementValue, incrementValue, MIN_ROW);
  const possibleDamePositionsWithoutCurrentPosition = Array.from(possibleDamePositions)
    .filter(position => position.column !== currentPosition.position.column && position.row !== currentPosition.position.row);
  filterPossiblePositions(positions, currentPosition, possibleDamePositionsWithoutCurrentPosition, possiblePositions);

}

function handleContinuousDecRowDecColumn(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  const possibleDamePositions = createPossiblePositions(currentPosition, decrementValue, decrementValue, MIN_ROW);
  const possibleDamePositionsWithoutCurrentPosition = Array.from(possibleDamePositions)
    .filter(position => position.column !== currentPosition.position.column && position.row !== currentPosition.position.row);
  filterPossiblePositions(positions, currentPosition, possibleDamePositionsWithoutCurrentPosition, possiblePositions);

}

export function handlePossibleMovesForDame(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handleContinuousIncRowIncColumn(positions, currentPosition, possiblePositions);
  handleContinuousIncRowDecColumn(positions, currentPosition, possiblePositions);
  handleContinuousDecRowIncColumn(positions, currentPosition, possiblePositions);
  handleContinuousDecRowDecColumn(positions, currentPosition, possiblePositions);
}
