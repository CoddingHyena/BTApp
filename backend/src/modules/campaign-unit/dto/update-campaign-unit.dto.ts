import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignUnitDto } from './create-campaign-unit.dto';

export class UpdateCampaignUnitDto extends PartialType(CreateCampaignUnitDto) {} 