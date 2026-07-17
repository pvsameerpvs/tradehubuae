import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Body } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    @Body("folder") folder: string = "uploads",
  ) {
    if (!file) throw new BadRequestException("File is required");

    return this.mediaService.uploadImage(file.buffer, file.originalname, folder);
  }
}
