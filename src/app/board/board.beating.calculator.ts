import {Piece, PiecePosition, Position} from '../piece/piece';
import {changePosition, getPieceByPosition, isPositionInBoard} from './board.calculator';
import {PossiblePositions} from './board.mover.calculator';

export function handleIncRowIncColumnBeating(positions: Map<Position, Piece>, currentPositions: PiecePosition, possiblePositions: PossiblePositions) {
  handleBeating(positions, currentPositions, possiblePositions, 1, 1);
}

export function handleIncRowDecColumnBeating(positions: Map<Position, Piece>, currentPositions: PiecePosition, possiblePositions: PossiblePositions) {
  handleBeating(positions, currentPositions, possiblePositions, 1, -1);
}

export function handleDecRowIncColumnBeating(positions: Map<Position, Piece>, currentPosition: PiecePosition, possiblePositions: PossiblePositions) {
  handleBeating(positions, currentPosition, possiblePositions, -1, 1);
}

export function handleDecRowDecColumnBeating(positions: Map<Position, Piece>, currentPositions: PiecePosition, possiblePositions: PossiblePositions) {
  handleBeating(positions, currentPositions, possiblePositions, -1, -1);
}

export function handleBeating(positions: Map<Position, Piece>, currentPositions: PiecePosition, possiblePositions: PossiblePositions, rowChange: number, columnChange: number) {
  const pieceInMiddleOfBeatPosition = getPieceByPosition(positions, changePosition(currentPositions.position, rowChange, columnChange));
  if (pieceInMiddleOfBeatPosition.piece && pieceInMiddleOfBeatPosition.piece.owner !== currentPositions.piece.owner) {
    const pieceOnFinishOfBeatPosition = getPieceByPosition(positions,
      changePosition(currentPositions.position, rowChange * 2, columnChange * 2));
    if (!pieceOnFinishOfBeatPosition.piece && isPositionInBoard(pieceOnFinishOfBeatPosition.position)) {
      possiblePositions.beatablePositions.push(pieceOnFinishOfBeatPosition.position);
    }
  }
}

