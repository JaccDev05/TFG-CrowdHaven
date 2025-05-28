import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient!: Client;
  private messageSubject = new Subject<any>();

  connect(userId: number) {
    this.stompClient = new Client({
      // Usa SockJS para crear el WebSocket
      brokerURL: 'ws://localhost:8080/ws',
  reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');

        this.stompClient.subscribe(
          `/user/${userId}/queue/messages`, // Cola personalizada por usuario
          (message: IMessage) => {
            const msg = JSON.parse(message.body);
            this.messageSubject.next(msg);
          }
        );
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    this.stompClient.activate();
  }

  sendMessage(senderId: number, receiverId: number, content: string) {
    if (this.stompClient && this.stompClient.connected) {
      const message = {
        senderId,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
      };

      this.stompClient.publish({
        destination: '/app/send', // debe coincidir con @MessageMapping("/send")
        body: JSON.stringify(message),
      });
    } else {
      console.warn('No STOMP connection available');
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }
}
