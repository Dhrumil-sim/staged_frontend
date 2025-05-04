import { Component } from '@angular/core';
import { CommonModule, NgSwitchCase } from '@angular/common'; // For ngSwitch
import { MatButtonModule } from '@angular/material/button'; // For buttons, if you want to use Material buttons
import { MatDialogModule } from '@angular/material/dialog'; // For dialog handling
import { SongsListComponent } from '../song/songs-list/songs-list.component';
import { AlbumsListComponent } from '../album/albums-list/albums-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-dashboard',
  imports: [
    CommonModule,
    MatButtonModule, // Add MatButtonModule to use Angular Material buttons
    MatDialogModule, // Add MatDialogModule if you're using dialogs in the component
    NgSwitchCase,
    SongsListComponent,
    AlbumsListComponent,
  ],
  templateUrl: './artist-dashboard.component.html',
  styleUrls: ['./artist-dashboard.component.css'],
  standalone: true,
})
export class ArtistDashboardComponent {
  constructor(private router: Router) {}
  selectedSection = 'songs'; // Default section is 'songs'

  showSection(section: string) {
    this.selectedSection = section; // Switch sections
  }
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
