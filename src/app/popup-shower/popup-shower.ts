import {Injectable} from '@angular/core';
import {ComponentConfig, ComponentInjector} from '../component-injector/component-injector';

@Injectable({
  providedIn: 'root'
})
export class PopupShower {

  private modalElementId = 'modal-container';
  private overlayElementId = 'overlay';

  constructor(private componentInjector: ComponentInjector) {
  }

  add(component: any, config: ComponentConfig) {
    this.componentInjector.appendComponentTo(this.modalElementId, component, config);
    document.getElementById(this.modalElementId).className = 'show';
    document.getElementById(this.overlayElementId).className = 'show';
  }

  rempve() {
    this.componentInjector.removeComponent();
    document.getElementById(this.modalElementId).className = 'hidden';
    document.getElementById(this.overlayElementId).className = 'hidden';
  }

}
