import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SquareComponent} from './square/square.component';
import {BoardComponent} from './board/board.component';
import {WinningInfoComponent} from './winning-info/winning-info.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent,
    BoardComponent,
    WinningInfoComponent,
  ],
  imports: [
    BrowserModule
  ],
  entryComponents: [WinningInfoComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
