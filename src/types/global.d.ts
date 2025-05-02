// src/types/global.d.ts or at the top of main.ts
import { Injector } from '@angular/core';

declare global {
  interface Window {
    ngInjector: Injector;
  }
}
