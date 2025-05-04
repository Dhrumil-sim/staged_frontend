/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SongService {
  private baseUrl = 'http://localhost:5000/api/song';

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getSongById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createSong(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, formData);
  }

  updateSong(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, formData);
  }

  deleteSong(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
