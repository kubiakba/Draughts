import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-winning-info',
  template: `
    <div class="winning-popup-info" [innerHTML]="popupText()"></div>`,
  styleUrls: ['./winning-info.component.scss']
})
export class WinningInfoComponent {

  @Input()
  winningPlayer: String;

  popupText(): String {
    return `${this.winningPlayer} has won !!`;
  }
}
