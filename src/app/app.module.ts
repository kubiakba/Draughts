import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SquareComponent} from './square/square.component';
import {BoardComponent} from './board/board.component';
import {WinningInfoComponent} from './winning-info/winning-info.component';
import {PopupInjector} from './popup-injector/popup-injector.service';

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
  providers: [PopupInjector],
  bootstrap: [AppComponent]
})
export class AppModule {
}
