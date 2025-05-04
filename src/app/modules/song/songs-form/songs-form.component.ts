import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../../shared/services/song.service';

@Component({
  selector: 'app-songs-form',
  templateUrl: './songs-form.component.html',
})
export class SongsFormComponent implements OnInit {
  songForm!: FormGroup;
  isEditMode = false;
  songId: string | null = null;
  coverPictureFile!: File;
  songFile!: File;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      genre: [[], Validators.required],
      album: [''],
    });

    this.songId = this.route.snapshot.paramMap.get('id');
    if (this.songId) {
      this.isEditMode = true;
      this.songService.getSongById(this.songId).subscribe((res) => {
        this.songForm.patchValue(res.song);
      });
    }
  }

  onCoverSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.coverPictureFile = file;
  }

  onSongFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.songFile = file;
  }

  onSubmit(): void {
    const formData = new FormData();
    const { title, genre, album } = this.songForm.value;

    formData.append('title', title);
    formData.append('genre', JSON.stringify(genre));
    if (album) formData.append('album', album);
    if (this.coverPictureFile) formData.append('coverPicture', this.coverPictureFile);
    if (this.songFile) formData.append('filePath', this.songFile);

    const request = this.isEditMode
      ? this.songService.updateSong(this.songId!, formData)
      : this.songService.createSong(formData);

    request.subscribe({
      next: () => this.router.navigate(['/songs']),
      error: (err) => alert(err?.error?.message || 'Something went wrong'),
    });
  }
}
