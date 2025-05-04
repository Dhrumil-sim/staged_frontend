import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from '../../../shared/services/song.service';
import { Song } from '../song.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  imports: [CommonModule, FormsModule],
})
export class SongsListComponent implements OnInit {
  songs: Song[] = [];
  genres: string[] = ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical'];

  // Filter & Search
  searchTerm = '';
  selectedGenre = '';
  sortBy = 'createdAt'; // or 'title'
  // Pagination
  currentPage = 1;
  limit = 5;
  totalPages = 1;
  constructor(
    private songService: SongService,
    private router: Router,
    public loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs() {
    this.loaderService.show('local');
    const query = {
      title: this.searchTerm,
      genre: this.selectedGenre,
      sortBy: this.sortBy,
      page: this.currentPage,
      limit: this.limit,
    };

    this.songService.getAllSongs(query).subscribe({
      next: (res) => {
        this.songs = res?.data?.songs || [];
        this.totalPages = Math.ceil(res?.data?.total / this.limit);

        const baseUrl = 'http://localhost:5000';
        this.songs = this.songs.map((song: Song) => ({
          ...song,
          coverPicture: `${baseUrl}/${song.coverPicture?.replace(/\\/g, '/').replace('public/', '')}`,
        }));
        this.loaderService.hide(); // ⬅️ Hide loader
      },
      error: (err) => {
        alert(err?.error?.message || 'Error fetching songs');
        this.loaderService.hide(); // ⬅️ Hide loader
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
