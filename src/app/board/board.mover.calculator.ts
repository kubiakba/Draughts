import {Piece, PiecePosition, PieceType, Player, Position} from '../piece/piece';
import {
  handleDecRowDecColumnBeating,
  handleDecRowIncColumnBeating,
  handleIncRowDecColumnBeating,
  handleIncRowIncColumnBeating
} from './board.beating.calculator';
import {changePosition, getPositionFromMap, isPositionInBoard} from './board.calculator';
import {handleBeatingPossibleMovesForDame} from './board.dame.possible.beating.moves';
import {handlePossibleMovesForDame} from './board.dame.possible.moves';

function removeCurrentPosition(positions: Map<Position, Piece>, currentPosition: PiecePosition) {
  const map: Map<Position, Piece> = new Map(positions);
  map.delete(getPositionFromMap(positions, currentPosition.position));
  return map;
}

export function getActivePlayerBeatingPositions(positions: Map<Position, Piece>, currentPosition: PiecePosition): Position[] {
  const map = removeCurrentPosition(positions, currentPosition);
  return Array.from(map.keys())
    .map(key => [key, positions.get(key)] as [Position, Piece])
    .filter(entry => entry[1].owner === currentPosition.piece.owner)
    .map(entry => calculatePossiblePositions(positions, new PiecePosition(entry[0], entry[1])))
    .map(entry => entry.beatablePositions)
    .reduce((a, b) => a.concat(b), []);
}

export function calculatePossiblePositions(positions: Map<Position, Piece>, currentPosition: PiecePosition): PossiblePositions {
  const possiblePositions: PossiblePositions = new PossiblePositions();
  if (currentPosition.piece.owner === Player.WHITE) {
    addPossiblePositionsForWhite(positions, currentPosition, possiblePositions);
  }
  if (currentPosition.piece.owner === Player.BLACK) {
    addPossiblePositionsForBlack(positions, currentPosition, possiblePositions);
  }
  return possiblePositions;
}

function addPossiblePositionsForWhite(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  addBeatingPossibleMoves(positions, currentPosition, possiblePositions);
  if (possiblePositions.beatablePositions.length === 0) {
    if (currentPosition.piece.type === PieceType.DAME) {
      handlePossibleMovesForDame(positions, currentPosition, possiblePositions);
    } else if (currentPosition.piece.type === PieceType.PAWN) {
      incRowAndColumnPossibleMove(positions, currentPosition, possiblePositions);
      incRowAndDecColumnPossibleMove(positions, currentPosition, possiblePositions);
    }
  }
}

function addPossiblePositionsForBlack(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  addBeatingPossibleMoves(positions, currentPosition, possiblePositions);
  if (possiblePositions.beatablePositions.length === 0) {
    if (currentPosition.piece.type === PieceType.DAME) {
      handlePossibleMovesForDame(positions, currentPosition, possiblePositions);
    } else if (currentPosition.piece.type === PieceType.PAWN) {
      addDecRowAndColumnPossibleMove(positions, currentPosition, possiblePositions);
    }
    addDecRowAndIncColumnPossibleMove(positions, currentPosition, possiblePositions);
  }
}

function addBeatingPossibleMoves(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  if (currentPosition.piece.type === PieceType.DAME) {
    handleBeatingPossibleMovesForDame(positions, currentPosition, possiblePositions);
  } else {
    handleIncRowIncColumnBeating(positions, currentPosition, possiblePositions);
    handleIncRowDecColumnBeating(positions, currentPosition, possiblePositions);
    handleDecRowIncColumnBeating(positions, currentPosition, possiblePositions);
    handleDecRowDecColumnBeating(positions, currentPosition, possiblePositions);
  }
}

function incRowAndDecColumnPossibleMove(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handlePossibleMoves(positions, currentPosition, possiblePositions, 1, -1);
}

function incRowAndColumnPossibleMove(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handlePossibleMoves(positions, currentPosition, possiblePositions, 1, 1);
}

function addDecRowAndColumnPossibleMove(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handlePossibleMoves(positions, currentPosition, possiblePositions, -1, -1);
}

function addDecRowAndIncColumnPossibleMove(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handlePossibleMoves(positions, currentPosition, possiblePositions, -1, 1);
}

function handlePossibleMoves(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions, rowChange: number, columnChange: number) {
  const changedPosition = changePosition(currentPosition.position, rowChange, columnChange);
  if (!getPositionFromMap(positions, changedPosition) && isPositionInBoard(changedPosition)) {
    possiblePositions.positions.push(changedPosition);
  }
}

export class PossiblePositions {
  positions: Position[] = [];
  beatablePositions: Position[] = [];
}

