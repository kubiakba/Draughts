import {ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector} from '@angular/core';
import {root} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class ComponentInjector {

  private childComponentRef: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {
  }

  public appendComponentTo(parentId: string, child: any, config: ComponentConfig) {
    const childComponentRef = this.componentFactoryResolver.resolveComponentFactory(child).create(this.injector);
    this.attachConfig(config, childComponentRef);
    this.appRef.attachView(childComponentRef.hostView);
    const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.getElementById(parentId).appendChild(childDomElem);
  }

  public removeComponent() {
    this.appRef.detachView(this.childComponentRef.hostView);
    this.childComponentRef.destroy();
  }

  private attachConfig(config: ComponentConfig, componentRef) {
    const inputs = config.inputs;
    const outputs = config.outputs;
    for (const input of inputs) {
      componentRef.instance[input.value[0]] = input.value[1];
    }
    for (const output of outputs) {
      componentRef.instance[output.value[0]] = output.value[1];
    }

  }
}

export interface ComponentConfig {
  inputs: Config[];
  outputs: Config[];
}

export interface Config {
  value: [string, any];
}

