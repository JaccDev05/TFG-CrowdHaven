import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../models/chat-message.model';
import { ChatMessageDTO } from '../../dtos/Chatmessage-dto';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/chat';

  constructor(private http: HttpClient) {}

  getHistory(user1Id: number, user2Id: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${user1Id}/${user2Id}`);
  }

  sendMessage(message: ChatMessageDTO): Observable<ChatMessageDTO> {
    return this.http.post<ChatMessageDTO>(`${this.apiUrl}/send`, message);
  }
}
