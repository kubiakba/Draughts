import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {PiecePosition} from '../piece/piece';

@Injectable({
  providedIn: 'root'
})
export class PieceMoverService {
  private subject = new Subject<PieceMover>();

  setPiece(pieceLocation: PiecePosition) {
    this.subject.next(new PieceMover(pieceLocation, PieceMoveStatus.SET));
  }

  removePiece(pieceLocation: PiecePosition) {
    this.subject.next(new PieceMover(pieceLocation, PieceMoveStatus.REMOVE));
  }

  getPieceLocation(): Observable<PieceMover> {
    return this.subject.asObservable();
  }
}

export class PieceMover {

  piece: PiecePosition;
  status: PieceMoveStatus;

  constructor(piece: PiecePosition, status: PieceMoveStatus) {
    this.piece = piece;
    this.status = status;
  }
}

export enum PieceMoveStatus {
  REMOVE, SET
}
