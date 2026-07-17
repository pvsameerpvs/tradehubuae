import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  namespace: "/chat",
  cors: { origin: "*", credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("chat:join")
  handleJoinSession(@ConnectedSocket() client: Socket, @MessageBody() data: { sessionId: string }) {
    client.join(`session:${data.sessionId}`);
    this.logger.log(`Client ${client.id} joined session ${data.sessionId}`);
  }

  @SubscribeMessage("chat:leave")
  handleLeaveSession(@ConnectedSocket() client: Socket, @MessageBody() data: { sessionId: string }) {
    client.leave(`session:${data.sessionId}`);
  }

  @SubscribeMessage("chat:message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; content: string; messageType?: string },
  ) {
    const message = await this.chatService.sendMessage(data.sessionId, {
      content: data.content,
      messageType: data.messageType,
    });
    this.server.to(`session:${data.sessionId}`).emit("chat:message:new", { message });
    this.server.emit("chat:unread:count", { sessionId: data.sessionId });
  }

  @SubscribeMessage("chat:typing")
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; isTyping: boolean },
  ) {
    client.to(`session:${data.sessionId}`).emit("chat:typing:update", {
      sessionId: data.sessionId,
      isTyping: data.isTyping,
    });
  }
}
