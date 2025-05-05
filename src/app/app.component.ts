import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { LoaderService } from './services/loader.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoaderComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'surify_frontend';

  constructor(public loaderService: LoaderService) {}
}
