import { Component } from '@angular/core';
import { SongsListComponent } from '../song/songs-list/songs-list.component';
import { AlbumsListComponent } from './albums-list/albums-list.component';

@Component({
  selector: 'app-album',
  imports: [SongsListComponent, AlbumsListComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css',
})
export class AlbumComponent {}
