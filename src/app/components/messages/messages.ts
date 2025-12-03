import { Component } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {
  constructor(public messageService: MessageService) {}
}
