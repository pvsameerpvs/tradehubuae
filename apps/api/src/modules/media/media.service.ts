import { Injectable, Logger } from "@nestjs/common";
import { storage } from "@tradehubuae/storage";

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  async uploadImage(
    buffer: Buffer,
    filename: string,
    folder: string = "uploads",
  ): Promise<{ url: string; key: string; size: number; format: string; width?: number; height?: number }> {
    const ext = filename.split(".").pop() ?? "jpg";
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const result = await storage.upload({
      buffer,
      key,
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      convertToWebP: true,
      maxWidth: 1920,
      quality: 80,
    });

    this.logger.log(`Image uploaded: ${result.url}`);
    return result;
  }
}
