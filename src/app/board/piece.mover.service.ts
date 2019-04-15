import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {PiecePosition} from '../piece/piece';

@Injectable({
  providedIn: 'root'
})
export class PieceMoverService {
  private subject = new Subject<PiecePosition>();

  setPiece(pieceLocation: PiecePosition) {
    this.subject.next(pieceLocation);
  }

  getPieceLocation(): Observable<PiecePosition> {
    return this.subject.asObservable();
  }
}
