import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../../shared/services/song.service';
import { songValidationSchema } from './song-form.validation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-songs-form',
  templateUrl: './songs-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class SongsFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  songId!: string;
  genres = ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical'];
  backendErrors: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private songService: SongService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.songId;

    this.form = this.fb.group({
      title: [''],
      genre: [[]],
      coverPicture: [null],
      filePath: [null],
    });

    if (this.isEditMode) {
      this.songService.getSongById(this.songId).subscribe((res) => {
        const song = res.song;
        this.form.patchValue({
          title: song.title,
          genre: song.genre,
        });
      });
    }
  }

  onFileChange(event: Event, field: 'coverPicture' | 'filePath') {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    if (file) {
      this.form.get(field)?.setValue(file);
    }
  }

  submitForm() {
    this.backendErrors = {};
    const formValue = this.form.value;

    // Joi validation
    const { error } = songValidationSchema.validate(
      {
        title: formValue.title,
        genre: formValue.genre,
        coverPicture: formValue.coverPicture,
        filePath: formValue.filePath,
      },
      { abortEarly: false },
    );

    if (error) {
      for (const detail of error.details) {
        const field = detail.path[0];
        this.backendErrors[field] = detail.message;
      }
      return;
    }

    const formData = new FormData();
    formData.append('title', formValue.title);
    formData.append('genre', JSON.stringify(formValue.genre));

    if (formValue.coverPicture) {
      formData.append('coverPicture', formValue.coverPicture);
    }

    if (formValue.filePath) {
      formData.append('filePath', formValue.filePath);
    }

    const request$ = this.isEditMode
      ? this.songService.updateSong(this.songId, formData)
      : this.songService.createSong(formData);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/artist']);
      },
      error: (err) => {
        if (err.error?.errors) {
          // For Joi backend validation errors
          for (const key in err.error.errors) {
            this.backendErrors[key] = err.error.errors[key];
          }
        } else {
          alert(err?.error?.message || 'Unexpected error');
        }
      },
    });
  }
}
