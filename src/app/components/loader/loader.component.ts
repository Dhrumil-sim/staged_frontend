// src/app/components/loader/loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  imports: [CommonModule],
})
export class LoaderComponent {
  loaderType$;

  constructor(private loaderService: LoaderService) {
    this.loaderType$ = this.loaderService.loader$;
  }
}
