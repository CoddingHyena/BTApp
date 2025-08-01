import { PartialType } from '@nestjs/swagger';
import { ValidateRawMechDto } from './validate-raw-mech.dto';

export class UpdateRawMechDto extends PartialType(ValidateRawMechDto) {}
