import { Module } from "@nestjs/common";
import { ComboOffersController } from "./combo-offers.controller";
import { ComboOffersService } from "./combo-offers.service";

@Module({
  controllers: [ComboOffersController],
  providers: [ComboOffersService],
  exports: [ComboOffersService],
})
export class ComboOffersModule {}
