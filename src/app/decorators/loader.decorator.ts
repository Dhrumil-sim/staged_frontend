/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/decorators/loader.decorator.ts
import { getAppInjector } from '../app-injector';
import { LoaderService } from '../services/loader.service';

export function WithLoader(type: 'global' | 'local') {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const loaderService = getAppInjector().get(LoaderService);
      loaderService.show(type);

      const result = originalMethod.apply(this, args);

      // Handle Promise (assume async method)
      if (result instanceof Promise) {
        return result.finally(() => loaderService.hide());
      }

      loaderService.hide(); // fallback for sync methods
      return result;
    };

    return descriptor;
  };
}
