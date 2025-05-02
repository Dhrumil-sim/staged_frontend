// src/app/app-injector.ts
import { Injector } from '@angular/core';

let appInjector: Injector;

export function setAppInjector(injector: Injector) {
  appInjector = injector;
}

export function getAppInjector(): Injector {
  if (!appInjector) throw new Error('Injector has not been set yet.');
  return appInjector;
}
