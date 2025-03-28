import { PartialType } from '@nestjs/swagger';
import { CreateMechAvailabilityDto } from './create-mech-availability.dto';

export class UpdateMechAvailabilityDto extends PartialType(CreateMechAvailabilityDto) {}