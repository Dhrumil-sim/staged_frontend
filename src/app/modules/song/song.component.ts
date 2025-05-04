import { Component } from '@angular/core';
import { SongsListComponent } from './songs-list/songs-list.component';

@Component({
  selector: 'app-song',
  imports: [SongsListComponent],
  templateUrl: './song.component.html',
  standalone: true,
  styleUrl: './song.component.css',
})
export class SongComponent {}
