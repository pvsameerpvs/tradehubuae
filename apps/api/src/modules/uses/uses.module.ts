import { Module } from "@nestjs/common";
import { UsesController } from "./uses.controller";
import { UsesService } from "./uses.service";

@Module({
  controllers: [UsesController],
  providers: [UsesService],
  exports: [UsesService],
})
export class UsesModule {}
