import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from '../../../shared/services/song.service';
import { Song } from '../song.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { SongsFormComponent } from '../songs-form/songs-form.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html',
  imports: [CommonModule, FormsModule, SongsFormComponent],
})
export class SongsListComponent implements OnInit {
  songs: Song[] = [];
  genres: string[] = ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical'];
  artistId = localStorage.getItem('artistId');
  //form rendering
  showForm = false;
  editSongId: string | null = null;

  onAddSong() {
    this.editSongId = null;
    this.showForm = true;
  }

  onEdit(songId: string) {
    this.editSongId = songId;
    this.showForm = true;
  }

  onFormClose() {
    this.showForm = false;
    this.editSongId = null;
    this.fetchSongs(); // refresh the list after form submission
  }

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
    private messageService: MessageService,
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

    console.log(this.artistId);

    this.songService.getSongsByArtistId(this.artistId!, query).subscribe({
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Error fetching songs',
        });
        this.loaderService.hide(); // ⬅️ Hide loader
      },
    });
  }

  onDelete(songId: string) {
    if (confirm('Are you sure you want to delete this song?')) {
      this.songService.deleteSong(songId).subscribe({
        next: () => {
          this.fetchSongs();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Song deleted successfully',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Deletion Error',
            detail: err?.error?.message || 'Failed to delete song',
          });
        },
      });
    }
  }
}
