import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignEconomyDto } from './create-campaign-economy.dto';

export class UpdateCampaignEconomyDto extends PartialType(CreateCampaignEconomyDto) {} 