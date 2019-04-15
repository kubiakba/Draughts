export class Piece {
  type: PieceType;
  owner: Player;

  constructor(type: PieceType, owner: Player) {
    this.type = type;
    this.owner = owner;
  }
}

export enum PieceType {
  PAWN, DAME
}

export enum Player {
  WHITE, BLACK
}

export class PiecePosition {

  position: string;
  piece: Piece;

  constructor(position: string, piece: Piece) {
    this.position = position;
    this.piece = piece;
  }
}
