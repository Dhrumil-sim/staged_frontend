import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { setAppInjector } from './app/app-injector'; // 👈 Import your custom injector setter

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    // ✅ Set the injector globally for decorator access
    setAppInjector(appRef.injector);
  })
  .catch((err) => console.error(err));
