try { require("dotenv").config({ path: require("path").resolve(process.cwd(), "../../.env") }); } catch {}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  app.setGlobalPrefix("api/v1");

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.enableCors({
    origin: configService.get<string>("CORS_ORIGIN")?.split(",") ?? ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = configService.get<number>("API_PORT", 4000);
  const host = configService.get<string>("API_HOST", "0.0.0.0");

  await app.listen(port, host);
  logger.log(`API running on http://${host}:${port}`);
  logger.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
}

bootstrap();
