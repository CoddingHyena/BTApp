import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignPlayerDto } from './create-campaign-player.dto';

export class UpdateCampaignPlayerDto extends PartialType(CreateCampaignPlayerDto) {} 