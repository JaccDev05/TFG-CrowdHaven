import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { ChatMessage } from '../../api/models/chat-message.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommunityService } from '../../api/services/community/community.service';
import { UserStateService } from '../../PagInicio/loginservices/user-state.service';
import { UserService } from '../../api/services/user/user.service';
import { User } from '../../api/models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatMessageDTO } from '../../api/dtos/Chatmessage-dto';
import { ChatService } from '../../api/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: ChatMessage[] = [];
  newMessage = '';
  user!: User;
  userLoggedId!: number;
  receiverId!: number;
  chatIsActive = false;
  receiverUser!: User;
  users: User[] = [];

  @ViewChild('bottom') bottom!: ElementRef; // marcador al final del chat

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private userStateService: UserStateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadSender();
    this.loadReceiver();
    setInterval(() => {
      if (this.chatIsActive) {
        this.loadMessages(this.userLoggedId, this.receiverId);
      }
    }, 3000);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.bottom?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {}
  }

  loadReceiver(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.receiverId = parseInt(idParam, 10);
    this.userService.getUserById(this.receiverId).subscribe(data => {
      this.receiverUser = data;
    });
  }

  loadSender(): void {
    const username = this.userStateService.getUsername();
    if (username) {
      this.userService.getUserProfile(username).subscribe(data => {
        this.user = data;
        this.userLoggedId = data.id;

        this.userService.getAllUsers().subscribe(allUsers => {
          this.users = allUsers.filter(u => u.id !== this.userLoggedId);
        });

        this.route.paramMap.subscribe(params => {
          const receiverIdParam = params.get('id');
          if (receiverIdParam) {
            this.receiverId = parseInt(receiverIdParam, 10);
            this.chatIsActive = true;
            this.loadMessages(this.userLoggedId, this.receiverId);
          } else {
            this.chatIsActive = false;
          }
        });
      });
    }
  }

  loadMessages(senderId: number, receiverId: number): void {
    this.chatService.getHistory(senderId, receiverId)
      .subscribe(res => {
        this.messages = res;
        // El scroll se maneja automáticamente por ngAfterViewChecked
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const message: ChatMessage = {
      senderId: this.userLoggedId,
      receiverId: this.receiverId,
      content: this.newMessage
    };

    this.chatService.sendMessage(message).subscribe(() => {
      this.newMessage = '';
      this.loadMessages(this.userLoggedId, this.receiverId);
    });
  }
}
