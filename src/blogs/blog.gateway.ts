import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class BlogsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Init');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendUpdatedBlogs(blogs: any) {
    this.server.emit('blogsUpdated', blogs);
  }

  sendUpdatedComments(blogId: number, comments: any) {
    this.server.emit('commentsUpdated', blogId, comments);
  }

  sendUpdatedReactions(blogId: any) {
    this.server.emit('reactionsUpdated', blogId);
  }
}
