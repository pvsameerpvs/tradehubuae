import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { db, type DB } from "@tradehubuae/database";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DrizzleService.name);
  public readonly db: DB;

  constructor() {
    this.db = db;
  }

  async onModuleInit() {
    this.logger.log("Database connected");
  }

  async onModuleDestroy() {
    this.logger.log("Database disconnected");
  }
}
