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

  position: Position;
  piece: Piece;

  constructor(position: Position, piece: Piece) {
    this.position = position;
    this.piece = piece;
  }
}

export class Position {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}
