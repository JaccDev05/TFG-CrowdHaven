import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../api/services/chat/chat.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,   // Para *ngFor, *ngIf
    FormsModule,    // Para [(ngModel)]
    RouterLink
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  currentUserId: number = 9;
  receiverId: number = 7;
  message: string = '';
  chatHistory: any[] = [];

  constructor(
    private chatService: ChatService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.currentUserId = parseInt(idParam, 10);
      }

      this.chatService.connect(this.currentUserId);

      this.chatService.getMessages().subscribe(msg => {
        // Solo mensajes entre los dos usuarios involucrados
        if (
          (msg.senderId === this.receiverId && msg.receiverId === this.currentUserId) ||
          (msg.senderId === this.currentUserId && msg.receiverId === this.receiverId)
        ) {
          this.chatHistory.push(msg);
        }
      });

      this.loadHistory();
    });
  }

  loadHistory() {
    this.http
      .get<any[]>(`http://localhost:8080/chat/history/${this.currentUserId}/${this.receiverId}`)
      .subscribe(data => {
        this.chatHistory = data;
      });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.currentUserId, this.receiverId, this.message);
      this.message = '';
    }
  }
}
