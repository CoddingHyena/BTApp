import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignPilotDto } from './create-campaign-pilot.dto';

export class UpdateCampaignPilotDto extends PartialType(CreateCampaignPilotDto) {}
