import { PartialType } from '@nestjs/swagger';
import { CreateMechDto } from './create-mech.dto';

export class UpdateMechDto extends PartialType(CreateMechDto) {}
