import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Messages } from './components/messages/messages';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, Messages],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Arènes du Mordor';

  auth = inject(AuthService);
}