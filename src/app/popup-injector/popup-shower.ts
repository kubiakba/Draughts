import {Injectable} from '@angular/core';
import {ComponentConfig, PopupInjector} from './popup-injector.service';
import {StartNewGame} from '../board-utils/start.new.game';

@Injectable({
  providedIn: 'root'
})
export class PopupShower {

  private modalElementId = 'modal-container';
  private overlayElementId = 'overlay';

  constructor(private popupInjector: PopupInjector, private startNewGame: StartNewGame) {
  }

  add(component: any, config: ComponentConfig) {
    this.popupInjector.appendComponentTo(this.modalElementId, component, config);
    document.getElementById(this.modalElementId).classList.remove('hidden');
    document.getElementById(this.overlayElementId).classList.remove('hidden');
  }

  remove() {
    this.popupInjector.removeComponent();
    document.getElementById(this.modalElementId).className = 'hidden';
    document.getElementById(this.overlayElementId).className = 'hidden';
    this.startNewGame.start();
  }

}
