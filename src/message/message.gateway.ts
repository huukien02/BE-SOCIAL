// message.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Messages Init');
  }

  sendMessage(conversationId: any) {
    this.server.emit('sendMessage', conversationId);
  }

  // Check user online
  private onlineUsers = new Map<number, string>();

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      console.log(`User ${userId} connected`);
      this.server.emit(
        'updateOnlineUsers',
        Array.from(this.onlineUsers.keys()),
      );
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(
      ([_, id]) => id === client.id,
    )?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
      this.server.emit(
        'updateOnlineUsers',
        Array.from(this.onlineUsers.keys()),
      );
    }
  }
}
