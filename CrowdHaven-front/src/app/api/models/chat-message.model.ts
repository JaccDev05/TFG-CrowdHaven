export interface ChatMessage {
    id?: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp?: string;
  }