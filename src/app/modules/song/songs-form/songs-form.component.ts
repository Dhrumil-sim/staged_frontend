import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() songId: string | null = null; // for edit mode
  @Output() formClose = new EventEmitter<void>(); // to notify parent

  form!: FormGroup;
  isEditMode = false;
  genres = ['Pop', 'Rock', 'Jazz', 'Hip-Hop', 'Classical'];
  backendErrors: Record<string, string> = {};

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.songId;

    this.form = this.fb.group({
      title: [''],
      genre: [[]],
      coverPicture: [null],
      filePath: [null],
    });

    if (this.isEditMode && this.songId) {
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

    const request$ =
      this.isEditMode && this.songId
        ? this.songService.updateSong(this.songId, formData)
        : this.songService.createSong(formData);

    request$.subscribe({
      next: () => {
        this.formClose.emit(); // ✅ Close the form and refresh parent
      },
      error: (err) => {
        console.error('Full backend error response:', err.error);
        const backendResponse = err.error;
        if (backendResponse) {
          alert(`❌ Error: ${backendResponse.message}\nCode: ${backendResponse.errorCode}`);
        }
      },
    });
  }

  onCancel() {
    this.formClose.emit(); // ✅ Cancel and notify parent
  }
}
