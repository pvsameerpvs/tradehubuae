import { PartialType } from "@nestjs/mapped-types";
import { CreateComboOfferDto } from "./create-combo-offer.dto";

export class UpdateComboOfferDto extends PartialType(CreateComboOfferDto) {}
