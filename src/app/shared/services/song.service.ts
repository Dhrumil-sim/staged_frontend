/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Injectable({ providedIn: 'root' })
export class SongService {
  private baseUrl = 'http://localhost:5000/api/song';

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
  ) {}

  // Fetch all songs with optional filters
  // Fetch all songs by artist ID with optional filters
  getSongsByArtistId(
    artistId: string,
    params?: {
      title?: string;
      genre?: string;
      sortBy?: string;
      page?: number;
      limit?: number;
    },
  ): Observable<any> {
    const queryParams = new URLSearchParams();

    if (params) {
      for (const key in params) {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null && value !== '') {
          queryParams.set(key, value.toString());
        }
      }
    }

    // Show loader before making the request
    this.loaderService.show('global');

    // Make the GET request to the new backend route
    return this.http
      .get(`${this.baseUrl}/artist/${artistId}?${queryParams.toString()}`)
      .pipe(finalize(() => this.loaderService.hide()));
  }

  // Fetch song by ID
  getSongById(id: string): Observable<any> {
    // Show loader before making the request
    this.loaderService.show('local');

    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      // Ensure loader is hidden after request completes (success or failure)
      finalize(() => this.loaderService.hide()),
    );
  }

  // Create a new song
  createSong(formData: FormData): Observable<any> {
    // Show loader before making the request
    this.loaderService.show('local');

    return this.http.post(`${this.baseUrl}/create`, formData).pipe(
      // Ensure loader is hidden after request completes (success or failure)
      finalize(() => this.loaderService.hide()),
    );
  }

  // Update an existing song
  updateSong(id: string, formData: FormData): Observable<any> {
    // Show loader before making the request
    this.loaderService.show('local');

    return this.http.put(`${this.baseUrl}/update/${id}`, formData).pipe(
      // Ensure loader is hidden after request completes (success or failure)
      finalize(() => this.loaderService.hide()),
    );
  }

  // Delete a song
  deleteSong(id: string): Observable<any> {
    // Show loader before making the request
    this.loaderService.show('local');

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      // Ensure loader is hidden after request completes (success or failure)
      finalize(() => this.loaderService.hide()),
    );
  }
}
