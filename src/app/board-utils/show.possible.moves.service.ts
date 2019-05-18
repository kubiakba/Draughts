import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Position} from '../piece/piece';

@Injectable({
  providedIn: 'root'
})
export class ShowPossibleMovesService {
  private subject = new Subject<PossibleMove>();

  showPossiblePosition(position: Position) {
    this.subject.next(new PossibleMove(position, true));
  }

  removePossiblePosition(position: Position) {
    this.subject.next(new PossibleMove(position, false));
  }

  getPossiblePosition(): Observable<PossibleMove> {
    return this.subject.asObservable();
  }
}

export class PossibleMove {

  position: Position;
  active: boolean;

  constructor(position: Position, active: boolean) {
    this.position = position;
    this.active = active;
  }
}
