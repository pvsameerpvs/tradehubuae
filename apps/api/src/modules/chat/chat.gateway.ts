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
import { JwtService } from "@nestjs/jwt";
import { ChatService } from "./chat.service";
import { Logger, UnauthorizedException } from "@nestjs/common";

@WebSocketGateway({
  namespace: "/chat",
  cors: { origin: "*", credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;

    if (token && typeof token === "string") {
      try {
        const payload = this.jwtService.verify(token);
        (client as any).user = payload;
        this.logger.log(`Authenticated client connected: ${client.id} (${payload.email})`);
        return;
      } catch {
        this.logger.warn(`Invalid token for client ${client.id}, allowing anonymous`);
      }
    }

    this.logger.log(`Anonymous client connected: ${client.id}`);
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
    const user = (client as any).user;
    const adminId = user?.role === "admin" || user?.role === "SUPER_ADMIN" ? user.sub : undefined;

    const message = await this.chatService.sendMessage(data.sessionId, {
      content: data.content,
      messageType: data.messageType,
    }, adminId);

    const session = await this.chatService.getSessionById(data.sessionId);

    this.server.to(`session:${data.sessionId}`).emit("chat:message:new", { message });
    this.server.to(`session:${data.sessionId}`).emit("chat:session:updated", { session });
    this.server.emit("chat:unread:count", { sessionId: data.sessionId });
  }

  @SubscribeMessage("chat:typing")
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; isTyping: boolean },
  ) {
    const user = (client as any).user;
    const adminName = user?.name ?? "Admin";

    client.to(`session:${data.sessionId}`).emit("chat:typing:update", {
      sessionId: data.sessionId,
      adminName,
      isTyping: data.isTyping,
    });
  }
}
