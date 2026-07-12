import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import { env } from "@tradehubuae/config";
import { logger } from "@tradehubuae/logger";

interface UploadOptions {
  buffer: Buffer;
  key: string;
  contentType: string;
  convertToWebP?: boolean;
  maxWidth?: number;
  quality?: number;
}

interface UploadResult {
  url: string;
  key: string;
  width?: number;
  height?: number;
  size: number;
  format: string;
}

class StorageService {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const endpoint = env.STORAGE_ENDPOINT;
    const region = env.AWS_REGION;

    this.client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });

    this.bucket = env.R2_BUCKET;
    this.publicUrl = env.R2_PUBLIC_URL;
    logger.info("Storage service initialized", { provider: env.STORAGE_PROVIDER, bucket: this.bucket });
  }

  private getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    let buffer = options.buffer;
    let format = options.contentType;
    let width: number | undefined;
    let height: number | undefined;

    if (options.contentType.startsWith("image/") && options.convertToWebP !== false) {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      width = metadata.width;
      height = metadata.height;

      if (options.maxWidth && width && width > options.maxWidth) {
        const ratio = options.maxWidth / width;
        width = options.maxWidth;
        height = height ? Math.round(height * ratio) : undefined;
        image.resize(width, height);
      }

      buffer = await image
        .webp({ quality: options.quality ?? 80 })
        .toBuffer();
      format = "image/webp";

      const webpKey = options.key.replace(/\.[^.]+$/, ".webp");
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: webpKey,
        Body: buffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      });

      await this.client.send(command);

      return {
        url: this.getPublicUrl(webpKey),
        key: webpKey,
        width,
        height,
        size: buffer.length,
        format: "webp",
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: options.key,
      Body: buffer,
      ContentType: options.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    await this.client.send(command);

    return {
      url: this.getPublicUrl(options.key),
      key: options.key,
      size: buffer.length,
      format,
    };
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn });
  }

  async list(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });
    const response = await this.client.send(command);
    return (response.Contents ?? []).map((obj) => obj.Key ?? "");
  }

  async uploadProductImage(
    buffer: Buffer,
    productId: string,
    filename: string,
  ): Promise<UploadResult> {
    const ext = filename.split(".").pop() ?? "jpg";
    const key = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    return this.upload({
      buffer,
      key,
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      convertToWebP: true,
      maxWidth: 1200,
      quality: 80,
    });
  }

  async uploadBlogImage(
    buffer: Buffer,
    postId: string,
    filename: string,
  ): Promise<UploadResult> {
    const ext = filename.split(".").pop() ?? "jpg";
    const key = `blog/${postId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    return this.upload({
      buffer,
      key,
      contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      convertToWebP: true,
      maxWidth: 1920,
      quality: 85,
    });
  }

  async uploadDocument(
    buffer: Buffer,
    type: "invoices" | "documents",
    filename: string,
  ): Promise<UploadResult> {
    const key = `${type}/${Date.now()}-${filename}`;

    return this.upload({
      buffer,
      key,
      contentType: "application/pdf",
      convertToWebP: false,
    });
  }
}

export const storage = new StorageService();
export type { UploadOptions, UploadResult };
