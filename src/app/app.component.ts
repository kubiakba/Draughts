import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-board></app-board>
    <div id="modal-container" class="hidden"></div>
    <div id="overlay" class="hidden"></div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
