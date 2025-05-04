import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from '../../../shared/services/song.service';
import { Song } from '../song.model';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
})
export class SongsListComponent implements OnInit {
  songs: Song[] = [];

  constructor(
    private songService: SongService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getAllSongs().subscribe({
      next: (res) => {
        this.songs = res?.data?.songs || [];
        console.log(this.songs);
      },
      error: (err) => {
        alert(err?.error?.message || 'Error fetching songs');
      },
    });
  }

  onEdit(songId: string) {
    this.router.navigate(['/songs/edit', songId]);
  }

  onDelete(songId: string) {
    if (confirm('Are you sure you want to delete this song?')) {
      this.songService.deleteSong(songId).subscribe(() => this.fetchSongs());
    }
  }
}
