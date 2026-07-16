import { PartialType } from "@nestjs/mapped-types";
import { CreateUseDto } from "./create-use.dto";

export class UpdateUseDto extends PartialType(CreateUseDto) {}
