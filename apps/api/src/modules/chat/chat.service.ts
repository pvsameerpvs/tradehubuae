import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { chatSessions, chatMessages, users, orders } from "@tradehubuae/database";
import { eq, and, desc, count, like, or, SQL } from "drizzle-orm";
import type { CreateSessionDto } from "./dto/create-session.dto";
import type { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private drizzle: DrizzleService) {}

  async createSession(dto: CreateSessionDto, userId?: string) {
    let userName = dto.userName;
    let userEmail = dto.userEmail;
    let userPhone = dto.userPhone;

    if (userId) {
      const [user] = await this.drizzle.db
        .select({ name: users.name, email: users.email, phone: users.phone })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      if (user) {
        userName = user.name ?? userName;
        userEmail = user.email ?? userEmail;
        userPhone = user.phone ?? userPhone;
      }
    }

    const [session] = await this.drizzle.db
      .insert(chatSessions)
      .values({
        userId: userId,
        userName,
        userEmail,
        userPhone,
        productContext: dto.productContext ?? null,
        source: "web",
        status: "new",
      })
      .returning();

    await this.drizzle.db
      .insert(chatMessages)
      .values({
        sessionId: session!.id,
        senderType: "system",
        messageType: "system",
        content: `Chat started by ${dto.userName}`,
      });

    this.logger.log(`Chat session created: ${session!.id} (${dto.userEmail})`);
    return session!;
  }

  async getSessions(query: { page?: number; limit?: number; status?: string; q?: string }) {
    const { page = 1, limit = 50, status, q } = query;
    const conditions: SQL[] = [];

    if (status) conditions.push(eq(chatSessions.status, status));
    if (q) {
      const searchCondition = or(
        like(chatSessions.userName, `%${q}%`),
        like(chatSessions.userEmail, `%${q}%`),
        like(chatSessions.userPhone, `%${q}%`),
      );
      if (searchCondition) conditions.push(searchCondition);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db.query.chatSessions.findMany({
      where,
      orderBy: [desc(chatSessions.lastMessageAt)],
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(chatSessions)
      .where(where);

    return {
      data,
      meta: {
        total: Number(totalResult?.total ?? 0),
        page,
        limit,
        totalPages: Math.ceil(Number(totalResult?.total ?? 0) / limit),
      },
    };
  }

  async getSessionById(id: string) {
    const [session] = await this.drizzle.db.query.chatSessions.findMany({
      where: eq(chatSessions.id, id),
    });

    if (!session) throw new NotFoundException("Session not found");
    return session;
  }

  async getMessages(sessionId: string) {
    return this.drizzle.db.query.chatMessages.findMany({
      where: eq(chatMessages.sessionId, sessionId),
      orderBy: [desc(chatMessages.createdAt)],
    });
  }

  async sendMessage(sessionId: string, dto: SendMessageDto, adminId?: string) {
    await this.getSessionById(sessionId);

    const [message] = await this.drizzle.db
      .insert(chatMessages)
      .values({
        sessionId,
        senderType: adminId ? "admin" : "user",
        adminId: adminId ?? null,
        messageType: dto.messageType ?? "text",
        content: dto.content,
      })
      .returning();

    await this.drizzle.db
      .update(chatSessions)
      .set({ lastMessageAt: new Date() })
      .where(eq(chatSessions.id, sessionId));

    return message!;
  }

  async assignSession(sessionId: string, adminId: string) {
    const [admin] = await this.drizzle.db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, adminId))
      .limit(1);

    const [session] = await this.drizzle.db
      .update(chatSessions)
      .set({ assignedAdminId: adminId, assignedAdminName: admin?.name ?? null })
      .where(eq(chatSessions.id, sessionId))
      .returning();

    await this.drizzle.db
      .insert(chatMessages)
      .values({
        sessionId,
        senderType: "system",
        messageType: "system",
        content: `Assigned to ${admin?.name ?? "Admin"}`,
      });

    return session!;
  }

  async closeSession(sessionId: string, closedBy?: string) {
    const [session] = await this.drizzle.db
      .update(chatSessions)
      .set({ status: "closed", closedAt: new Date(), closedBy: closedBy ?? null })
      .where(eq(chatSessions.id, sessionId))
      .returning();

    return session!;
  }

  async reopenSession(sessionId: string) {
    const [session] = await this.drizzle.db
      .update(chatSessions)
      .set({ status: "in_progress", closedAt: null, closedBy: null })
      .where(eq(chatSessions.id, sessionId))
      .returning();

    return session!;
  }

  async updateSessionStatus(sessionId: string, status: "new" | "in_progress" | "closed") {
    const [session] = await this.drizzle.db
      .update(chatSessions)
      .set({
        status,
        closedAt: status === "closed" ? new Date() : null,
        closedBy: status === "closed" ? undefined : null,
      })
      .where(eq(chatSessions.id, sessionId))
      .returning();

    if (!session) throw new NotFoundException("Session not found");
    return session;
  }

  async getUserById(userId: string) {
    const [user] = await this.drizzle.db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async getUserOrders(userId: string) {
    return this.drizzle.db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            product: { columns: { name: true, slug: true } },
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
      limit: 20,
    });
  }
}
