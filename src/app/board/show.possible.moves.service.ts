import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowPossibleMovesService {
  private subject = new Subject<string>();

  showPossiblePosition(pieceLocation: string) {
    this.subject.next(pieceLocation);
  }

  getPossiblePosition(): Observable<string> {
    return this.subject.asObservable();
  }
}
