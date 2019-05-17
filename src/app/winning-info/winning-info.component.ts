import {Component, Input} from '@angular/core';
import {PopupShower} from '../popup-shower/popup-shower';

@Component({
  selector: 'app-winning-info',
  template: `
    <div class="winning-popup-info">
      <div class="winning-popup-info-winner" [innerHTML]="popupText()"></div>
      <button class="popup-winning-popup-play-again-button" [innerHTML]="wantPlayAgain()" (click)="startNewGame()"></button>
    </div>
  `,
  styleUrls: ['./winning-info.component.scss']
})
export class WinningInfoComponent {

  @Input()
  winningPlayer: String;

  constructor(private popupShower: PopupShower) {
  }

  popupText(): String {
    return `${this.winningPlayer} has won !!`;
  }

  wantPlayAgain(): String {
    return `Wanna play again ?`;
  }

  startNewGame() {
    this.popupShower.remove();
  }
}
