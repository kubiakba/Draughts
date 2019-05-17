import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartNewGame {
  private startNewGame: Subject<boolean> = new Subject();

  start() {
    this.startNewGame.next(true);
  }

  getObservable(): Observable<boolean> {
    return this.startNewGame.asObservable();
  }
}
