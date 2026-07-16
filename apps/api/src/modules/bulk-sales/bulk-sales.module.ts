import { Module } from "@nestjs/common";
import { BulkSalesController } from "./bulk-sales.controller";
import { BulkSalesService } from "./bulk-sales.service";

@Module({
  controllers: [BulkSalesController],
  providers: [BulkSalesService],
})
export class BulkSalesModule {}
